const NVIDIA_EMBED_URL = "https://integrate.api.nvidia.com/v1/embeddings";
const EMBED_MODEL = "nvidia/nemotron-3-embed-1b"; // 2048-dim, matches the SQL column above

export async function getEmbedding(
  text: string,
  inputType: "query" | "passage" = "query"
): Promise<number[]> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY is not set");

  const res = await fetch(NVIDIA_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: [text],
      model: EMBED_MODEL,
      input_type: inputType, // "query" for user questions, "passage" for stored content
      truncate: "END",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Embedding request failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}