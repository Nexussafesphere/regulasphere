import os
import json
import time
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

INSERT_BATCH_SIZE = 200   # rows per insert() call
FETCH_PAGE_SIZE = 1000    # rows per page when fetching existing keys


def fetch_all_rows(table, fields):
    """Page through a table and return all rows for the given fields.
    Avoids Supabase's default row cap on a single select() call."""
    all_rows = []
    start = 0
    while True:
        end = start + FETCH_PAGE_SIZE - 1
        resp = supabase.table(table).select(fields).range(start, end).execute()
        rows = resp.data or []
        all_rows.extend(rows)
        if len(rows) < FETCH_PAGE_SIZE:
            break
        start += FETCH_PAGE_SIZE
    return all_rows


def batch_insert(table, records, batch_size=INSERT_BATCH_SIZE):
    """Insert records in chunks. Returns (success_count, error_count)."""
    success = 0
    errors = 0
    for i in range(0, len(records), batch_size):
        chunk = records[i:i + batch_size]
        try:
            supabase.table(table).insert(chunk).execute()
            success += len(chunk)
        except Exception as e:
            # fall back to one-by-one for this chunk so a single bad row
            # doesn't sink the whole batch
            print(f"    Batch insert failed ({len(chunk)} rows), retrying individually: {e}")
            for row in chunk:
                try:
                    supabase.table(table).insert(row).execute()
                    success += 1
                except Exception as row_err:
                    errors += 1
                    label = row.get("title") or row.get("prompt", "")[:60]
                    print(f"      Error on: {label} | {row_err}")
        if (i // batch_size) % 10 == 0 and i > 0:
            print(f"    ...{i + len(chunk)}/{len(records)} inserted so far")
    return success, errors


def load_regulatory_obligations(filepath="data/regulatory_obligations.json"):
    print("\n" + "=" * 60)
    print("LOADING REGULATORY OBLIGATIONS")
    print("=" * 60)

    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return 0

    with open(filepath, "r", encoding="utf-8") as f:
        obligations = json.load(f)

    print(f"Total obligations to load: {len(obligations)}")

    # Dedupe on (regulator, title) — title alone isn't unique across regulators
    # (e.g. "Registration of Company" appears under CAC, CBN, etc. separately)
    print("Fetching existing obligations...")
    existing_rows = fetch_all_rows("regulatory_obligations", "regulator,title")
    existing_keys = {(r.get("regulator", ""), r.get("title", "")) for r in existing_rows}
    print(f"  {len(existing_keys)} already in database")

    to_insert = []
    skipped_count = 0

    for obligation in obligations:
        title = obligation.get("title", "")
        regulator = obligation.get("regulator", "Unknown")
        key = (regulator, title)

        if key in existing_keys:
            skipped_count += 1
            continue

        to_insert.append({
            "regulator": regulator,
            "title": title,
            "description": obligation.get("description", ""),
            "legal_basis": obligation.get("legal_basis", ""),
            "deadline_type": obligation.get("deadline_type", "Ongoing"),
            "deadline_value": obligation.get("deadline_value", ""),
            "penalty": obligation.get("penalty", ""),
            "penalty_type": obligation.get("penalty_type", "Fixed"),
            "penalty_amount": obligation.get("penalty_amount", ""),
            "category": obligation.get("category", "General"),
            "priority": obligation.get("priority", "Medium"),
            "remediation_steps": obligation.get("remediation_steps", []),
            "applicable_sectors": obligation.get("applicable_sectors", ["All"]),
            "minimum_employees": obligation.get("minimum_employees", 0),
            "trigger_conditions": obligation.get("trigger_conditions", {}),
            "source_url": obligation.get("source_url", ""),
            "source_document": obligation.get("source_document", ""),
        })
        existing_keys.add(key)  # guard against dupes within the same file

    print(f"Inserting {len(to_insert)} new obligations (skipped {skipped_count} existing)...")
    success_count, error_count = batch_insert("regulatory_obligations", to_insert)

    print(f"\nResult: {success_count} inserted | {skipped_count} skipped | {error_count} errors")
    return success_count


def load_training_examples(filepath="data/training_examples.json"):
    print("\n" + "=" * 60)
    print("LOADING TRAINING EXAMPLES")
    print("=" * 60)

    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return 0

    with open(filepath, "r", encoding="utf-8") as f:
        examples = json.load(f)

    print(f"Total examples to load: {len(examples)}")

    print("Fetching existing training examples...")
    existing_rows = fetch_all_rows("ai_training_data", "prompt,completion")
    existing_keys = {(r.get("prompt", ""), r.get("completion", "")) for r in existing_rows}
    print(f"  {len(existing_keys)} already in database")

    to_insert = []
    skipped_count = 0

    for example in examples:
        prompt = example.get("prompt", "")
        completion = example.get("completion", "")
        key = (prompt, completion)

        if not prompt or not completion or key in existing_keys:
            skipped_count += 1
            continue

        to_insert.append({
            "prompt": prompt,
            "completion": completion,
            "category": example.get("category", "General"),
            "language": example.get("language", "English"),
            "quality_score": 5,
            "is_validated": False,
        })
        existing_keys.add(key)

    print(f"Inserting {len(to_insert)} new examples (skipped {skipped_count} existing)...")
    success_count, error_count = batch_insert("ai_training_data", to_insert)

    print(f"\nResult: {success_count} inserted | {skipped_count} skipped | {error_count} errors")
    return success_count


def load_multilingual(filepath="data/multilingual_translations.json"):
    print("\n" + "=" * 60)
    print("LOADING MULTILINGUAL TRANSLATIONS")
    print("=" * 60)

    if not os.path.exists(filepath):
        print(f"No multilingual file found: {filepath}")
        return 0

    with open(filepath, "r", encoding="utf-8") as f:
        translations = json.load(f)

    total_items = sum(len(items) for items in translations.values())
    print(f"Total translations to load: {total_items}")

    # KEY FIX: dedupe on (source_title, language, prompt) instead of prompt alone.
    # The translated question text ("What do I need to do?" in Yoruba, etc.) repeats
    # across almost every obligation — deduping on prompt alone silently drops
    # nearly all of them, keeping only the first obligation's translations.
    print("Fetching existing multilingual entries...")
    existing_rows = fetch_all_rows("ai_training_data", "source_title,language,prompt")
    existing_keys = {
        (r.get("source_title", ""), r.get("language", ""), r.get("prompt", ""))
        for r in existing_rows
    }
    print(f"  {len(existing_keys)} already in database")

    to_insert = []
    skipped_count = 0

    for language, items in translations.items():
        lang_new = 0
        for item in items:
            source_title = item.get("original_title", "")
            prompt = item.get("prompt", "")
            completion = item.get("completion", item.get("translated_content", ""))

            if not prompt or not completion:
                skipped_count += 1
                continue

            key = (source_title, language, prompt)
            if key in existing_keys:
                skipped_count += 1
                continue

            to_insert.append({
                "prompt": prompt,
                "completion": completion,
                "category": item.get("category", "General"),
                "language": language,
                "source_title": source_title,
                "quality_score": 5,
                "is_validated": False,
            })
            existing_keys.add(key)
            lang_new += 1

        print(f"  {language}: {lang_new} new rows queued")

    print(f"\nInserting {len(to_insert)} new translations (skipped {skipped_count} existing)...")
    success_count, error_count = batch_insert("ai_training_data", to_insert)

    print(f"\nResult: {success_count} inserted | {skipped_count} skipped | {error_count} errors")
    return success_count


def main():
    print("=" * 60)
    print("REGULASPHERE DATA LOADER")
    print("=" * 60)

    total = 0
    total += load_regulatory_obligations()
    total += load_training_examples()
    total += load_multilingual()

    print("\n" + "=" * 60)
    print(f"COMPLETE - {total} total records inserted")
    print("=" * 60)


if __name__ == "__main__":
    main()