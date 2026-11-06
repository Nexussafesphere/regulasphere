"""
Regulasphere multilingual translation — refactored for speed + per-language resume.

Key properties:
1. ONE API call per obligation covering only the languages that are still
   MISSING for that obligation (not a fixed "all 4 or nothing"). If Yoruba
   is already done for a title, it will never be re-requested, even if
   Hausa/Igbo/Pidgin still need work.
2. Concurrent requests via ThreadPoolExecutor.
3. Thread-safe progress saving with a lock + periodic flush.
4. Obligations that are already fully done (all 4 languages present) are
   skipped entirely — zero API calls for them.

Tune CONCURRENCY based on how the free tier behaves for you. Start at 5,
watch for repeated 429s in the logs, adjust up or down.
"""

import os
import json
import time
import threading
import openai
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed

load_dotenv(".env.local")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
NVIDIA_MODEL = "openai/gpt-oss-120b"

client = openai.OpenAI(
    base_url=NVIDIA_BASE_URL,
    api_key=NVIDIA_API_KEY
)

# --- Tuning knobs -----------------------------------------------------------
CONCURRENCY = 5          # number of obligations translated in parallel
SAVE_EVERY = 10          # flush progress to disk every N completed obligations
MAX_TOKENS = 4000        # covers up to 4 languages x 3 qa pairs; auto-shrinks per request
MAX_RETRIES = 5
REQUEST_TIMEOUT = 150
# -----------------------------------------------------------------------------

LANGUAGES = {
    "Yoruba": "Yoruba language (Southwest Nigeria)",
    "Hausa": "Hausa language (Northern Nigeria)",
    "Igbo": "Igbo language (Southeast Nigeria)",
    "Pidgin": "Nigerian Pidgin English",
}

progress_lock = threading.Lock()
save_counter = {"n": 0}


def build_system_prompt(langs):
    schema_blocks = ",\n".join(
        f'  "{lang}": [\n'
        f'    {{"prompt": "...", "completion": "...", "category": "..."}},\n'
        f'    {{"prompt": "...", "completion": "...", "category": "..."}},\n'
        f'    {{"prompt": "...", "completion": "...", "category": "..."}}\n'
        f'  ]'
        for lang in langs
    )
    lang_list = ", ".join(langs)
    return f"""You are a professional translator specializing in Nigerian languages \
({lang_list}).
Translate compliance content while keeping technical terms, regulator names, and legal references in English.
Return ONLY valid JSON — no markdown fences, no commentary — in this exact shape, for ONLY these languages: {lang_list}

{{
{schema_blocks}
}}

Each language must have exactly 3 Q&A pairs:
1. "What do I need to do?" — the requirement, translated
2. "What happens if I don't comply?" — the penalty, translated
3. "How do I fix this?" — the remediation steps, translated
"""


def call_llm(system_prompt, user_prompt, max_tokens, temperature=0.2, max_retries=MAX_RETRIES):
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
                top_p=0.7,
                timeout=REQUEST_TIMEOUT,
            )
            return response.choices[0].message.content

        except Exception as e:
            error_msg = str(e)

            if "503" in error_msg or "ResourceExhausted" in error_msg:
                wait_time = 10 * (attempt + 1)
                print(f"    [503] Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            elif "Connection" in error_msg or "timeout" in error_msg.lower() or "timed out" in error_msg.lower():
                wait_time = 5 * (attempt + 1)
                print(f"    [conn] Connection/timeout error. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            elif "429" in error_msg:
                wait_time = 12 * (attempt + 1)
                print(f"    [429] Too many requests. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            else:
                print(f"    API Error: {e}")
                return None

    print("    Max retries reached. Skipping.")
    return None


def parse_json_response(content):
    if not content:
        return None
    content = content.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start = content.find("{")
        end = content.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(content[start:end])
            except json.JSONDecodeError:
                pass
        return None


def build_user_prompt(obligation, langs):
    title = obligation.get("title", "")
    description = obligation.get("description", "")
    legal_basis = obligation.get("legal_basis", "")
    deadline = obligation.get("deadline_value", "")
    penalty = obligation.get("penalty", "")
    remediation = obligation.get("remediation_steps", [])
    lang_list = ", ".join(langs)

    return f"""
Translate this Nigerian compliance requirement into ONLY these languages: {lang_list}.
Return a single JSON object following the exact schema in the system prompt (one key per requested language).

Original English:
Title: {title}
Description: {description}
Legal Basis: {legal_basis}
Deadline: {deadline}
Penalty: {penalty}
Remediation Steps: {', '.join(remediation) if remediation else 'None'}

Keep regulator names (NDPC, NITDA, CAC, NRS, CBN, SEC, PENCOM, ITF, NSITF, NAFDAC), NGN amounts,
and legal section references in English in every language's translation.
"""


def translate_obligation(obligation, langs):
    """One API call for only the given languages -> dict {lang: [3 qa pairs]} or None."""
    if not langs:
        return {}
    system_prompt = build_system_prompt(langs)
    user_prompt = build_user_prompt(obligation, langs)
    # scale token budget down when requesting fewer languages
    tokens = max(1200, int(MAX_TOKENS * len(langs) / len(LANGUAGES)))
    response = call_llm(system_prompt, user_prompt, max_tokens=tokens)
    if not response:
        return None
    parsed = parse_json_response(response)
    if not parsed or not isinstance(parsed, dict):
        return None
    # keep only the languages we actually asked for
    return {lang: parsed[lang] for lang in langs if lang in parsed}


def save_progress(translations, filepath):
    with progress_lock:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(translations, f, indent=2, ensure_ascii=False)


def load_progress(filepath):
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        for lang in LANGUAGES:
            data.setdefault(lang, [])
        return data
    return {lang: [] for lang in LANGUAGES}


def backfill_missing_language_field(all_translations):
    """For any existing entries saved before the 'language' field was added,
    fill it in based on which top-level key (language) they're stored under.
    Returns the number of entries that were fixed."""
    fixed = 0
    for lang, items in all_translations.items():
        for item in items:
            if isinstance(item, dict) and not item.get("language"):
                item["language"] = lang
                fixed += 1
    return fixed


def per_language_done_titles(all_translations):
    """{language: set(titles already translated for that language)}"""
    return {
        lang: {item.get("original_title", "") for item in items if isinstance(item, dict)}
        for lang, items in all_translations.items()
    }


def process_one(obligation, missing_langs, index, total):
    title = obligation.get("title", "")
    print(f"  [{index+1}/{total}] {title[:55]}  -> needs: {', '.join(missing_langs)}")
    result = translate_obligation(obligation, missing_langs)
    return title, result


def main():
    print("=" * 60)
    print("REGULASPHERE MULTILINGUAL TRANSLATION (fast/batched, per-language resume)")
    print("=" * 60)

    obligations_file = "data/regulatory_obligations.json"
    if not os.path.exists(obligations_file):
        print(f"File not found: {obligations_file}")
        print("Run build_datasets.py first.")
        return

    with open(obligations_file, "r", encoding="utf-8") as f:
        obligations = json.load(f)

    output_file = "data/multilingual_translations.json"
    all_translations = load_progress(output_file)

    fixed_count = backfill_missing_language_field(all_translations)
    if fixed_count:
        print(f"Backfilled missing 'language' field on {fixed_count} existing entries.")
        save_progress(all_translations, output_file)

    done_by_lang = per_language_done_titles(all_translations)

    # Build (obligation, missing_langs) pairs — skip obligations with nothing missing.
    work_items = []
    for obligation in obligations:
        title = obligation.get("title", "")
        missing = [lang for lang in LANGUAGES if title not in done_by_lang.get(lang, set())]
        if missing:
            work_items.append((obligation, missing))

    fully_done = len(obligations) - len(work_items)
    total_missing_calls = len(work_items)
    print(f"Loaded {len(obligations)} obligations")
    for lang in LANGUAGES:
        print(f"  {lang}: {len(done_by_lang.get(lang, set()))} already translated")
    print(f"Fully complete (all 4 languages): {fully_done}")
    print(f"Obligations needing at least one language: {total_missing_calls}")
    print(f"Concurrency: {CONCURRENCY} workers")

    total_completed = 0
    total_failed = 0

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = {
            executor.submit(process_one, obligation, missing, i, len(work_items)): (obligation, missing)
            for i, (obligation, missing) in enumerate(work_items)
        }

        for future in as_completed(futures):
            title, result = future.result()

            if result is not None and result:
                with progress_lock:
                    for lang, items in result.items():
                        for item in items:
                            item["original_title"] = title
                            item["language"] = lang
                        all_translations.setdefault(lang, []).extend(items)
                total_completed += 1
                print(f"    Done: {title[:60]}")
            else:
                total_failed += 1
                print(f"    Failed: {title[:60]}")

            save_counter["n"] += 1
            if save_counter["n"] % SAVE_EVERY == 0:
                save_progress(all_translations, output_file)
                print(f"    -- progress saved ({save_counter['n']} processed) --")

    save_progress(all_translations, output_file)

    print("\n" + "=" * 60)
    print("TRANSLATION COMPLETE")
    print(f"  Translated (at least 1 language): {total_completed}")
    print(f"  Failed: {total_failed}")
    print(f"  Saved: {output_file}")
    print("=" * 60)


if __name__ == "__main__":
    main()
