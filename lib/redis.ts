const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

interface RedisResponse {
  result: string | null;
}

async function redisRequest<T>(
  command: string,
  ...args: (string | number)[]
): Promise<T> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Upstash Redis credentials not set");
  }

  const response = await fetch(UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([command, ...args]),
  });

  if (!response.ok) {
    throw new Error(`Redis request failed: ${response.status}`);
  }

  return response.json();
}

export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<boolean> {
  try {
    if (ttlSeconds) {
      await redisRequest<RedisResponse>("SETEX", key, ttlSeconds, value);
    } else {
      await redisRequest<RedisResponse>("SET", key, value);
    }
    return true;
  } catch {
    return false;
  }
}

export async function cacheGet(key: string): Promise<string | null> {
  try {
    const response = await redisRequest<RedisResponse>("GET", key);
    return response.result;
  } catch {
    return null;
  }
}

export async function cacheDelete(key: string): Promise<boolean> {
  try {
    await redisRequest<RedisResponse>("DEL", key);
    return true;
  } catch {
    return false;
  }
}

export async function cacheComplianceScore(
  businessId: string,
  score: number,
  ttlSeconds: number = 3600
): Promise<boolean> {
  return cacheSet(`compliance_score:${businessId}`, String(score), ttlSeconds);
}

export async function getCachedComplianceScore(
  businessId: string
): Promise<number | null> {
  const cached = await cacheGet(`compliance_score:${businessId}`);
  return cached ? parseInt(cached, 10) : null;
}

export async function cacheBusinessObligations(
  businessId: string,
  obligations: string,
  ttlSeconds: number = 3600
): Promise<boolean> {
  return cacheSet(`obligations:${businessId}`, obligations, ttlSeconds);
}

export async function getCachedBusinessObligations(
  businessId: string
): Promise<string | null> {
  return cacheGet(`obligations:${businessId}`);
}