import { createClient } from "@supabase/supabase-js";
import { getEmbedding } from "./embeddings";

// Independent client (service role) so this module doesn't depend on
// whatever supabase-admin.ts happens to export internally.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface RetrievedChunk {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  regulator: string;
  similarity: number;
}

export async function retrieveRelevantChunks(
  query: string,
  language: string = "English",
  matchCount: number = 5
): Promise<RetrievedChunk[]> {
  try {
    const queryEmbedding = await getEmbedding(query, "query");

    const { data, error } = await supabase.rpc("match_knowledge_chunks", {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      filter_language: language,
    });

    if (error) {
      console.error("RAG retrieval error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("RAG embedding/retrieval failed:", err);
    return []; // fail open — chat still works even if retrieval breaks
  }
}

export function formatChunksForPrompt(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return "";
  return chunks
    .map((c, i) => `[${i + 1}] ${c.title}${c.regulator ? ` (${c.regulator})` : ""}\n${c.content}`)
    .join("\n\n");
}