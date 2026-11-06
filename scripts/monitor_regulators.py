import os
import re
import json
import hashlib
import time
import requests
import openai
from bs4 import BeautifulSoup
from datetime import datetime
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(".env.local")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
NVIDIA_MODEL = "meta/llama-3.2-90b-vision-instruct"

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

client = openai.OpenAI(base_url=NVIDIA_BASE_URL, api_key=NVIDIA_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

HASH_FILE = "data/regulator_hashes.json"

REGULATOR_SOURCES = [
    {"regulator": "NDPC", "url": "https://ndpc.gov.ng", "keywords": ["audit", "breach", "DPIA", "fine", "penalty"]},
    {"regulator": "NITDA", "url": "https://nitda.gov.ng", "keywords": ["AI governance", "cybersecurity", "framework", "regulation"]},
    {"regulator": "CAC", "url": "https://cac.gov.ng", "keywords": ["annual returns", "registration", "compliance"]},
    {"regulator": "NRS", "url": "https://www.nrs.gov.ng", "keywords": ["tax", "VAT", "CIT", "WHT", "deadline"]},
    {"regulator": "CBN", "url": "https://cbn.gov.ng", "keywords": ["fintech", "AML", "licensing", "capital requirement"]},
    {"regulator": "SEC", "url": "https://sec.gov.ng", "keywords": ["digital assets", "VASP", "capital market"]},
    {"regulator": "PENCOM", "url": "https://pencom.gov.ng", "keywords": ["pension", "remittance", "RSA", "micro-pension"]},
    {"regulator": "ITF", "url": "https://itf.gov.ng", "keywords": ["levy", "training", "reimbursement"]},
    {"regulator": "NSITF", "url": "https://nsitf.gov.ng", "keywords": ["compensation", "registration", "employee"]},
    {"regulator": "NAFDAC", "url": "https://nafdac.gov.ng", "keywords": ["registration", "product", "regulation"]},
]

ANALYSIS_SYSTEM_PROMPT = """You are a Nigerian regulatory compliance expert.
Analyze regulatory updates and determine affected sectors, severity, and required actions.
Return valid JSON with:
{
  "title": "Short update title",
  "summary": "Brief summary",
  "action_required": "What businesses must do",
  "affected_sectors": ["Fintech", "Healthcare"],
  "severity": "High",
  "deadline_date": "2026-09-30 or null"
}"""


def load_hashes():
    if os.path.exists(HASH_FILE):
        with open(HASH_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_hashes(hashes):
    with open(HASH_FILE, "w", encoding="utf-8") as f:
        json.dump(hashes, f, indent=2, ensure_ascii=False)


def call_llama(system_prompt, user_prompt, max_tokens=1000, temperature=0.1, max_retries=5):
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=NVIDIA_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=0.7
            )
            return response.choices[0].message.content

        except Exception as e:
            error_msg = str(e)

            if "503" in error_msg or "ResourceExhausted" in error_msg:
                wait_time = 10 * (attempt + 1)
                print(f"    Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            elif "Connection" in error_msg or "timeout" in error_msg.lower() or "timed out" in error_msg.lower():
                wait_time = 5 * (attempt + 1)
                print(f"    Connection/timeout error. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            elif "429" in error_msg:
                wait_time = 12 * (attempt + 1)
                print(f"    Too many requests. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            else:
                print(f"    API Error: {e}")
                return None

    print(f"    Max retries reached. Skipping.")
    return None


def analyze_update(text, regulator):
    prompt = f"""
Analyze this {regulator} regulatory update:

{text[:4000]}
"""

    response = call_llama(ANALYSIS_SYSTEM_PROMPT, prompt)

    if response:
        content = response.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            start = content.find("{")
            end = content.rfind("}") + 1
            if start >= 0 and end > start:
                try:
                    return json.loads(content[start:end])
                except json.JSONDecodeError:
                    return None

    return None


def extract_clean_text(html):
    """Strip scripts/styles/nav/footer noise, return clean visible text."""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        tag.decompose()
    text = soup.get_text(separator=" ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def check_regulator_updates(source, known_hashes):
    regulator = source["regulator"]
    url = source["url"]
    keywords = source.get("keywords", [])

    print(f"Checking {regulator}...")

    try:
        response = requests.get(
            url,
            timeout=30,
            headers={"User-Agent": "RegulaSphere-Monitor/1.0"},
        )

        if response.status_code != 200:
            print(f"  HTTP {response.status_code}")
            return [], known_hashes

        clean_text = extract_clean_text(response.text)

        if len(clean_text) < 200:
            print(f"  Warning: very little text extracted ({len(clean_text)} chars) — site may be JS-rendered")

        # Hash the clean visible text, not raw HTML (raw HTML has dynamic noise:
        # session tokens, timestamps, cache busters — changes every run otherwise)
        content_hash = hashlib.md5(clean_text.encode("utf-8")).hexdigest()
        previous_hash = known_hashes.get(regulator, "")

        if content_hash == previous_hash:
            print(f"  No change detected (hash unchanged)")
            return [], known_hashes

        # Cheap pre-filter: skip the LLM call entirely if none of the regulator's
        # keywords appear anywhere in the page — saves API calls on irrelevant changes
        if keywords and not any(kw.lower() in clean_text.lower() for kw in keywords):
            print(f"  Content changed but no relevant keywords found — skipping LLM analysis")
            known_hashes[regulator] = content_hash
            return [], known_hashes

        known_hashes[regulator] = content_hash
        print(f"  Change detected. Analyzing...")

        analysis = analyze_update(clean_text[:5000], regulator)

        if analysis:
            update_data = {
                "regulator": regulator,
                "title": analysis.get("title", f"{regulator} Update"),
                "summary": analysis.get("summary", "New regulatory update detected"),
                "action_required": analysis.get("action_required", ""),
                "deadline_date": analysis.get("deadline_date") if analysis.get("deadline_date") else None,
                "affected_sectors": analysis.get("affected_sectors", ["All"]),
                "severity": analysis.get("severity", "Medium"),
                "source_url": url,
                "content_hash": content_hash,
                "is_ai_detected": True,
            }

            # Dedupe on the stable content hash, not the AI-generated title
            # (title text can vary slightly between runs for the same real update)
            existing = (
                supabase.table("regulatory_updates")
                .select("id")
                .eq("content_hash", content_hash)
                .eq("regulator", regulator)
                .execute()
            )

            if existing.data and len(existing.data) > 0:
                print(f"  Already recorded this content hash")
                return [], known_hashes

            supabase.table("regulatory_updates").insert(update_data).execute()
            print(f"  Saved update: {update_data['title']}")
            return [update_data], known_hashes
        else:
            print(f"  No significant update detected")
            return [], known_hashes

    except requests.exceptions.Timeout:
        print(f"  Timeout")
        return [], known_hashes
    except requests.exceptions.ConnectionError:
        print(f"  Connection error")
        return [], known_hashes
    except Exception as e:
        print(f"  Error: {e}")
        return [], known_hashes


def generate_alerts(updates):
    for update in updates:
        affected_sectors = update.get("affected_sectors", ["All"])

        try:
            if "All" in affected_sectors:
                businesses = supabase.table("businesses").select("id, business_name").execute()
            else:
                businesses = (
                    supabase.table("businesses")
                    .select("id, business_name")
                    .in_("sector", affected_sectors)
                    .execute()
                )

            business_list = businesses.data if businesses.data else []

            for business in business_list:
                alert_data = {
                    "business_id": business["id"],
                    "activity_type": "Alert",
                    "description": f"New {update['regulator']} update: {update['title']}",
                    "metadata": {
                        "update_title": update["title"],
                        "severity": update.get("severity", "Medium"),
                        "action_required": update.get("action_required", ""),
                    },
                }

                supabase.table("agent_activities").insert(alert_data).execute()

            print(f"  Alerted {len(business_list)} businesses")

        except Exception as e:
            print(f"  Alert error: {e}")


def main():
    print("=" * 60)
    print("REGULASPHERE REGULATOR MONITORING")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    known_hashes = load_hashes()
    all_updates = []

    for source in REGULATOR_SOURCES:
        updates, known_hashes = check_regulator_updates(source, known_hashes)
        all_updates.extend(updates)

    save_hashes(known_hashes)

    if all_updates:
        generate_alerts(all_updates)

    print("\n" + "=" * 60)
    print(f"Complete. {len(all_updates)} new updates detected.")
    print("=" * 60)


if __name__ == "__main__":
    main()