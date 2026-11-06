import os
import openai
from dotenv import load_dotenv

load_dotenv(".env.local")

api_key = os.getenv("NVIDIA_API_KEY")
print(f"API Key loaded: {bool(api_key)}")
print(f"Key starts with: {api_key[:10]}..." if api_key else "Key is None")

client = openai.OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=api_key
)

print("Sending test request to Llama 3...")

try:
    response = client.chat.completions.create(
        model="meta/llama-3.3-70b-instruct",
        messages=[{"role": "user", "content": "Say hello in one word"}],
        max_tokens=10
    )
    print(f"Response: {response.choices[0].message.content}")
    print("API works.")
except Exception as e:
    print(f"Error: {e}")