import os
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv(".env.local")

UPSTASH_REDIS_REST_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_REDIS_REST_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")

def redis_command(command, *args):
    url = UPSTASH_REDIS_REST_URL
    
    payload = json.dumps([command, *args]).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {UPSTASH_REDIS_REST_TOKEN}",
            "Content-Type": "application/json"
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Redis Error: {e.code}")
        print(e.read().decode())
        return None

if __name__ == "__main__":
    print(f"Upstash URL: {'SET' if UPSTASH_REDIS_REST_URL else 'NOT SET'}")
    print(f"Upstash Token: {'SET' if UPSTASH_REDIS_REST_TOKEN else 'NOT SET'}")
    
    # Test SET
    print("\nTesting SET...")
    result = redis_command("SET", "test_key", "regulasphere_working")
    print(f"SET result: {result}")
    
    # Test GET
    print("\nTesting GET...")
    result = redis_command("GET", "test_key")
    print(f"GET result: {result}")
    
    # Test DELETE
    print("\nTesting DELETE...")
    result = redis_command("DEL", "test_key")
    print(f"DEL result: {result}")