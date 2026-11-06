import os
import time
import openai
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(".env.local")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
EMBED_MODEL = "nvidia/nemotron-3-embed-1b"

client = openai.OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=NVIDIA_API_KEY)
supabase = create_client(os.getenv("NEXT_PUBLIC_SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

BATCH_SIZE = 10  # texts per embedding API call
INSERT_BATCH = 100


def embed_batch(texts, input_type="passage", max_retries=5):
    for attempt in range(max_retries):
        try:
            resp = client.embeddings.create(
                model=EMBED_MODEL,
                input=texts,
                extra_body={"input_type": input_type, "truncate": "END"},
            )
            return [d.embedding for d in resp.data]
        except Exception as e:
            wait = 8 * (attempt + 1)
            print(f"  Embedding error, retrying in {wait}s: {e}")
            time.sleep(wait)
    return [None] * len(texts)


def fetch_all(table, fields):
    rows, start = [], 0
    while True:
        resp = supabase.table(table).select(fields).range(start, start + 999).execute()
        batch = resp.data or []
        rows.extend(batch)
        if len(batch) < 1000:
            break
        start += 1000
    return rows


def already_embedded_titles(source_table):
    rows = fetch_all("knowledge_chunks", "source_title")
    return {r["source_title"] for r in rows if r.get("source_title")}


def embed_obligations():
    print("Embedding regulatory_obligations...")
    obligations = fetch_all(
        "regulatory_obligations",
        "title,description,legal_basis,penalty,regulator,category,remediation_steps,deadline_type,deadline_value",
    )
    done = already_embedded_titles("regulatory_obligations")
    todo = [o for o in obligations if o["title"] not in done]
    print(f"  {len(todo)} of {len(obligations)} need embeddings")

    for i in range(0, len(todo), BATCH_SIZE):
        batch = todo[i:i + BATCH_SIZE]
        texts = []
        for o in batch:
            deadline_type = o.get("deadline_type") or ""
            deadline_value = o.get("deadline_value") or ""
            deadline_str = deadline_type
            if deadline_value:
                deadline_str = f"{deadline_type} ({deadline_value})"

            text = (
                f"{o.get('regulator','')}: {o.get('title','')}. "
                f"Category: {o.get('category','')}. "
                f"{o.get('description','')} "
                f"Deadline: {deadline_str}. "
                f"Legal basis: {o.get('legal_basis','')}. "
                f"Penalty: {o.get('penalty','')}. "
                f"Remediation: {', '.join(o.get('remediation_steps') or [])}"
            )
            texts.append(text)

        embeddings = embed_batch(texts, "passage")

        rows = []
        for o, text, emb in zip(batch, texts, embeddings):
            if emb is None:
                continue
            rows.append({
                "source_table": "regulatory_obligations",
                "source_title": o["title"],
                "title": o["title"],
                "content": text,
                "category": o.get("category"),
                "language": "English",
                "regulator": o.get("regulator"),
                "embedding": emb,
            })

        if rows:
            supabase.table("knowledge_chunks").insert(rows).execute()
        print(f"  {min(i + BATCH_SIZE, len(todo))}/{len(todo)} done")


def embed_training_data(limit_per_language=None):
    print("Embedding ai_training_data...")
    rows_data = fetch_all("ai_training_data", "id,prompt,completion,category,language,source_title")

    done_ids = {
        (r.get("source_title") or "") + "|" + (r.get("language") or "")
        for r in fetch_all("knowledge_chunks", "source_title,language")
    }

    by_lang = {}
    for r in rows_data:
        lang = r.get("language") or "English"
        by_lang.setdefault(lang, []).append(r)

    for language, items in by_lang.items():
        if limit_per_language:
            items = items[:limit_per_language]
        todo = [
            r for r in items
            if ((r.get("source_title") or "") + "|" + language) not in done_ids
        ]
        print(f"  {language}: {len(todo)} need embeddings")

        for i in range(0, len(todo), BATCH_SIZE):
            batch = todo[i:i + BATCH_SIZE]
            texts = [f"{r.get('prompt') or ''} {r.get('completion') or ''}" for r in batch]
            embeddings = embed_batch(texts, "passage")

            insert_rows = []
            for r, text, emb in zip(batch, texts, embeddings):
                if emb is None:
                    continue
                insert_rows.append({
                    "source_table": "ai_training_data",
                    "source_title": r.get("source_title") or "",
                    "title": (r.get("source_title") or "") or (r.get("prompt") or "")[:80],
                    "content": text,
                    "category": r.get("category"),
                    "language": language,
                    "regulator": None,
                    "embedding": emb,
                })

            if insert_rows:
                supabase.table("knowledge_chunks").insert(insert_rows).execute()
            print(f"    {language}: {min(i + BATCH_SIZE, len(todo))}/{len(todo)} done")


if __name__ == "__main__":
    embed_obligations()
    # Start with a cap to control time/cost, raise or remove once you've validated quality
    embed_training_data(limit_per_language=500)