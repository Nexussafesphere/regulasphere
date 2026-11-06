import os
from openai import OpenAI
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(".env.local")

client = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=os.getenv("NVIDIA_API_KEY"))
supabase = create_client(os.getenv("NEXT_PUBLIC_SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

query = "What happens if I miss the NDPC audit deadline?"

resp = client.embeddings.create(
    model="nvidia/nemotron-3-embed-1b",
    input=[query],
    extra_body={"input_type": "query", "truncate": "END"},
)
embedding = resp.data[0].embedding

result = supabase.rpc("match_knowledge_chunks", {
    "query_embedding": embedding,
    "match_count": 5,
    "filter_language": "English",
}).execute()

for r in result.data:
    print(f"{r['similarity']:.3f}  {r['title']}  ({r['regulator']})")