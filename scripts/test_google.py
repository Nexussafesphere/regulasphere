import os
import json
import base64
import httpx
from dotenv import load_dotenv

load_dotenv(".env.local")

GOOGLE_CLOUD_API_KEY = os.getenv("GOOGLE_CLOUD_API_KEY")


def test_tts():
    url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={GOOGLE_CLOUD_API_KEY}"

    payload = {
        "input": {"text": "Stay compliant. Stay ahead."},
        "voice": {"languageCode": "en-NG", "name": "en-NG-Standard-A"},
        "audioConfig": {"audioEncoding": "MP3"},
    }

    headers = {"Content-Type": "application/json"}

    try:
        # httpx handles SSL differently and may bypass Avast interference
        with httpx.Client(verify=False, timeout=60) as client:
            response = client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            audio_content = data.get("audioContent", "")
            print(f"TTS generated: {len(audio_content)} characters of base64 audio")

            if audio_content:
                audio_bytes = base64.b64decode(audio_content)
                output_path = os.path.join(os.path.dirname(__file__), "test_output.mp3")
                with open(output_path, "wb") as f:
                    f.write(audio_bytes)
                print(f"Audio saved to: {output_path}")
    except httpx.HTTPStatusError as e:
        print(f"TTS HTTP Error: {e.response.status_code}")
        print(e.response.text)
    except httpx.RequestError as e:
        print(f"TTS Error: {e}")


if __name__ == "__main__":
    test_tts()