import os
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv(".env.local")

TERMII_API_KEY = os.getenv("TERMII_API_KEY")
TERMII_SENDER_ID = os.getenv("TERMII_SENDER_ID", "RegulaSphere")

def send_test_sms(to_phone):
    url = "https://api.ng.termii.com/api/sms/send"
    
    payload = json.dumps({
        "to": to_phone,
        "from": TERMII_SENDER_ID,
        "sms": "RegulaSphere test SMS. Your compliance platform is working!",
        "type": "plain",
        "channel": "generic"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TERMII_API_KEY}"
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"SMS sent successfully!")
            print(f"Response: {response.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"Error sending SMS: {e.code}")
        print(e.read().decode())

if __name__ == "__main__":
    print(f"Termii API Key: {'SET' if TERMII_API_KEY else 'NOT SET'}")
    print(f"Sender ID: {TERMII_SENDER_ID}")
    print(f"\nNote: Use format 234XXXXXXXXXX (no + sign)")
    to_phone = input("Enter phone number to test (e.g., 2348012345678): ")
    send_test_sms(to_phone)