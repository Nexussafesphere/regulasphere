import os
import json
from dotenv import load_dotenv

load_dotenv(".env.local")

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")

import urllib.request
import urllib.error

def send_test_email(to_email):
    url = "https://api.resend.com/emails"
    
    payload = json.dumps({
        "from": f"RegulaSphere <{RESEND_FROM_EMAIL}>",
        "to": [to_email],
        "subject": "RegulaSphere Test Email",
        "html": "<h1>RegulaSphere is working!</h1><p>This is a test email from your compliance platform.</p>"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {RESEND_API_KEY}"
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Email sent successfully!")
            print(f"Response: {response.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"Error sending email: {e.code}")
        print(e.read().decode())

if __name__ == "__main__":
    print(f"Resend API Key: {'SET' if RESEND_API_KEY else 'NOT SET'}")
    print(f"From Email: {RESEND_FROM_EMAIL}")
    print(f"\nNote: With test domain, you can only send to your own verified email.")
    to_email = input("Enter your email to test: ")
    send_test_email(to_email)