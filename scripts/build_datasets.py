import os
import json
import time
import openai
from dotenv import load_dotenv

load_dotenv(".env.local")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
NVIDIA_MODEL = "openai/gpt-oss-120b"

client = openai.OpenAI(
    base_url=NVIDIA_BASE_URL,
    api_key=NVIDIA_API_KEY
)

EXTRACTION_SYSTEM_PROMPT = """You are a Nigerian regulatory compliance expert.
Extract structured compliance obligations from regulatory documents.
Return valid JSON array of objects with these exact fields:
{
  "regulator": "NDPC",
  "title": "Short name of requirement",
  "description": "What the business must do",
  "legal_basis": "Specific law section",
  "deadline_type": "Fixed Date | Annual | Quarterly | Monthly | Ongoing | Before Activity",
  "deadline_value": "March 15 or 21st of every month",
  "penalty": "Description of penalty",
  "penalty_type": "Fixed | Percentage | Both | Daily",
  "penalty_amount": "NGN 10,000,000 or 2% of revenue",
  "category": "Tax | Data Protection | Pension | Licensing | Employment | CAC | AI Governance",
  "priority": "Critical | High | Medium | Low",
  "remediation_steps": ["step1", "step2"],
  "applicable_sectors": ["Fintech", "Healthcare", "All"],
  "minimum_employees": 0,
  "trigger_conditions": {"data_processing": true, "uses_ai": false}
}"""


def call_llama(system_prompt, user_prompt, max_tokens=4000, temperature=0.1, max_retries=5):
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

            elif "Connection" in error_msg:
                wait_time = 5 * (attempt + 1)
                print(f"    Connection error. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            else:
                print(f"    API Error: {e}")
                return None

    print(f"    Max retries reached. Skipping.")
    return None


def parse_json_response(content):
    if not content:
        return None

    content = content.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start = content.find("[")
        end = content.rfind("]") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(content[start:end])
            except json.JSONDecodeError:
                pass

        start = content.find("{")
        end = content.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(content[start:end])
            except json.JSONDecodeError:
                pass

        return None


def chunk_text(text, max_chars=10000):
    chunks = []
    words = text.split()
    current_chunk = []
    current_length = 0

    for word in words:
        current_length += len(word) + 1
        if current_length > max_chars:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
        else:
            current_chunk.append(word)

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def extract_obligations(text, regulator, source_document):
    all_obligations = []
    chunks = chunk_text(text)

    print(f"  Processing {len(chunks)} chunks...")

    for i, chunk in enumerate(chunks):
        print(f"    Chunk {i+1}/{len(chunks)}: Sending to Llama 3...")

        prompt = f"""
Extract ALL compliance obligations from this {regulator} regulatory document.

Regulator: {regulator}
Source Document: {source_document}

Document Text:
{chunk}
"""

        response = call_llama(EXTRACTION_SYSTEM_PROMPT, prompt)

        if response:
            parsed = parse_json_response(response)
            if parsed:
                if isinstance(parsed, list):
                    all_obligations.extend(parsed)
                    print(f"    Extracted {len(parsed)} obligations")
                elif isinstance(parsed, dict):
                    all_obligations.append(parsed)
                    print(f"    Extracted 1 obligation")
            else:
                print(f"    Could not parse response")
        else:
            print(f"    No response from API")

        time.sleep(1)

    return all_obligations


def generate_training_examples(obligations, regulator):
    training_examples = []

    for obligation in obligations:
        title = obligation.get("title", "")
        description = obligation.get("description", "")
        legal_basis = obligation.get("legal_basis", "")
        deadline = obligation.get("deadline_value", "")
        penalty = obligation.get("penalty", "")
        remediation = obligation.get("remediation_steps", [])
        category = obligation.get("category", "General")

        training_examples.append({
            "prompt": f"What are my {regulator} compliance obligations?",
            "completion": f"You must comply with {title}. {description} This is based on {legal_basis}. Deadline: {deadline}. Penalty for non-compliance: {penalty}.",
            "category": category,
            "language": "English"
        })

        training_examples.append({
            "prompt": f"What happens if I don't comply with {title}?",
            "completion": f"If you fail to comply with {title}, you face: {penalty}. To avoid this, follow these steps: {'; '.join(remediation) if remediation else 'Contact a compliance consultant.'}",
            "category": category,
            "language": "English"
        })

        training_examples.append({
            "prompt": f"When is the deadline for {title}?",
            "completion": f"The deadline for {title} is {deadline}. It is a {obligation.get('deadline_type', 'periodic')} requirement.",
            "category": category,
            "language": "English"
        })

        training_examples.append({
            "prompt": f"How do I comply with {title}?",
            "completion": f"To comply with {title}, follow these steps: {', '.join(remediation) if remediation else 'Review the requirements and consult a compliance expert.'}",
            "category": category,
            "language": "English"
        })

    return training_examples


def save_progress(obligations, filepath):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(obligations, f, indent=2, ensure_ascii=False)


def load_progress(filepath):
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def build_obligations_dataset(extracted_data):
    all_obligations = []
    processed_docs = set()
    progress_file = "data/regulatory_obligations.json"

    existing = load_progress(progress_file)
    if existing:
        all_obligations.extend(existing)
        processed_docs = {ob.get("source_document", "") for ob in existing}
        print(f"  Resuming: {len(existing)} obligations already saved from {len(processed_docs)} documents")

    total_docs = len(extracted_data)

    for idx, (key, text) in enumerate(extracted_data.items()):
        regulator = key.split("/")[0]
        document = key.split("/")[-1] if "/" in key else key

        if document in processed_docs:
            print(f"[{idx+1}/{total_docs}] Already processed: {regulator}/{document}")
            continue

        print(f"\n[{idx+1}/{total_docs}] Processing: {regulator}/{document}")

        obligations = extract_obligations(text, regulator, document)

        if obligations:
            for ob in obligations:
                ob["source_document"] = document
                ob["source_url"] = ""
            all_obligations.extend(obligations)
            print(f"  Extracted: {len(obligations)}")

        save_progress(all_obligations, progress_file)
        print(f"  Progress saved. Total: {len(all_obligations)}")

    return all_obligations


def build_training_dataset(obligations):
    all_examples = []

    by_regulator = {}
    for ob in obligations:
        regulator = ob.get("regulator", "Unknown")
        if regulator not in by_regulator:
            by_regulator[regulator] = []
        by_regulator[regulator].append(ob)

    for regulator, obs in by_regulator.items():
        examples = generate_training_examples(obs, regulator)
        all_examples.extend(examples)
        print(f"  {regulator}: {len(examples)} examples")

    return all_examples


def main():
    print("=" * 60)
    print("REGULASPHERE DATASET BUILDER (NVIDIA)")
    print("=" * 60)

    print("Step 1: Checking environment...")
    print(f"  NVIDIA_API_KEY set: {bool(NVIDIA_API_KEY)}")

    print("Step 2: Checking for extracted data...")
    extracted_file = "data/extracted_regulations.json"

    if not os.path.exists(extracted_file):
        print(f"  File not found: {extracted_file}")
        return

    print("  File found. Loading...")

    with open(extracted_file, "r", encoding="utf-8") as f:
        extracted_data = json.load(f)

    print(f"  Loaded {len(extracted_data)} documents")

    print("Step 3: Extracting obligations...")
    obligations = build_obligations_dataset(extracted_data)
    print(f"\n  Total obligations: {len(obligations)}")

    print("Step 4: Saving obligations...")
    save_progress(obligations, "data/regulatory_obligations.json")
    print("  Saved.")

    print("Step 5: Generating training examples...")
    training_examples = build_training_dataset(obligations)
    print(f"  Generated {len(training_examples)} examples")

    print("Step 6: Saving training examples...")
    with open("data/training_examples.json", "w", encoding="utf-8") as f:
        json.dump(training_examples, f, indent=2, ensure_ascii=False)
    print("  Saved.")

    print("=" * 60)
    print("COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()