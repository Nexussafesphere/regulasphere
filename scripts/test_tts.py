"""
Google Cloud Text-to-Speech client.

Usage:
    python scripts/test_tts.py "Stay compliant. Stay ahead." --voice en-GB-Neural2-A --lang en-GB
"""

from __future__ import annotations

import argparse
import base64
import logging
import os
import sys
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("tts")

TTS_ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize"
VOICES_ENDPOINT = "https://texttospeech.googleapis.com/v1/voices"
DEFAULT_TIMEOUT = 30.0
MAX_RETRIES = 3
RETRY_BACKOFF_SECONDS = 2.0


class TTSConfigError(Exception):
    """Raised when required configuration (e.g. API key) is missing."""


class TTSRequestError(Exception):
    """Raised when the Google API returns a non-retryable error."""


def load_api_key(env_file: str = ".env.local") -> str:
    """Load and validate the Google Cloud API key from the environment."""
    load_dotenv(env_file)
    api_key = os.getenv("GOOGLE_CLOUD_API_KEY")
    if not api_key:
        raise TTSConfigError(
            f"GOOGLE_CLOUD_API_KEY not found. Checked {env_file} and process environment."
        )
    return api_key


def list_english_voices(api_key: str, timeout: float = DEFAULT_TIMEOUT) -> list[dict]:
    """Fetch and return all English-language voices currently supported by the API."""
    with httpx.Client(timeout=timeout) as client:
        response = client.get(VOICES_ENDPOINT, params={"key": api_key})
        response.raise_for_status()
        voices = response.json().get("voices", [])
        return [v for v in voices if any(code.startswith("en-") for code in v["languageCodes"])]


def synthesize_speech(
    text: str,
    api_key: str,
    *,
    language_code: str = "en-US",
    voice_name: str = "en-US-Neural2-F",
    audio_encoding: str = "MP3",
    speaking_rate: float = 1.0,
    timeout: float = DEFAULT_TIMEOUT,
    max_retries: int = MAX_RETRIES,
) -> bytes:
    """
    Synthesize speech from text via the Google Cloud TTS API.

    Returns raw audio bytes. Raises TTSRequestError for non-retryable
    API errors (bad voice name, invalid key, quota exceeded, etc.).
    """
    if not text or not text.strip():
        raise ValueError("text must be a non-empty string")

    payload = {
        "input": {"text": text},
        "voice": {"languageCode": language_code, "name": voice_name},
        "audioConfig": {"audioEncoding": audio_encoding, "speakingRate": speaking_rate},
    }

    last_error: Exception | None = None

    with httpx.Client(timeout=timeout) as client:
        for attempt in range(1, max_retries + 1):
            try:
                response = client.post(
                    TTS_ENDPOINT,
                    params={"key": api_key},
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
                audio_b64 = data.get("audioContent")
                if not audio_b64:
                    raise TTSRequestError("API returned 200 but no audioContent was present")
                return base64.b64decode(audio_b64)

            except httpx.HTTPStatusError as exc:
                status = exc.response.status_code
                body = exc.response.text

                # 4xx errors (bad voice name, invalid key, malformed request) won't
                # succeed on retry — fail fast with the API's own error message.
                if 400 <= status < 500:
                    raise TTSRequestError(f"HTTP {status}: {body}") from exc

                # 5xx / rate limiting are worth retrying with backoff.
                logger.warning("Attempt %d/%d failed (HTTP %d), retrying...", attempt, max_retries, status)
                last_error = exc

            except httpx.RequestError as exc:
                # Network-level failures: DNS, connection reset, timeout, etc.
                logger.warning("Attempt %d/%d network error: %s", attempt, max_retries, exc)
                last_error = exc

            if attempt < max_retries:
                time.sleep(RETRY_BACKOFF_SECONDS * attempt)

    raise TTSRequestError(f"All {max_retries} attempts failed. Last error: {last_error}") from last_error


def save_audio(audio_bytes: bytes, output_path: Path) -> None:
    """Write audio bytes to disk, creating parent directories if needed."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(audio_bytes)
    logger.info("Saved %d bytes to %s", len(audio_bytes), output_path)


def main() -> int:
    parser = argparse.ArgumentParser(description="Test Google Cloud Text-to-Speech")
    parser.add_argument("text", nargs="?", default="Stay compliant. Stay ahead.", help="Text to synthesize")
    parser.add_argument("--lang", default="en-US", help="Language code, e.g. en-US, en-GB")
    parser.add_argument("--voice", default="en-US-Neural2-F", help="Voice name, e.g. en-US-Neural2-F")
    parser.add_argument("--rate", type=float, default=1.0, help="Speaking rate (0.25 - 4.0)")
    parser.add_argument(
        "--output",
        default=str(Path(__file__).parent / "test_output.mp3"),
        help="Output file path",
    )
    parser.add_argument("--list-voices", action="store_true", help="List available English voices and exit")
    args = parser.parse_args()

    try:
        api_key = load_api_key()
    except TTSConfigError as exc:
        logger.error(str(exc))
        return 1

    if args.list_voices:
        try:
            voices = list_english_voices(api_key)
        except httpx.HTTPStatusError as exc:
            logger.error("Failed to list voices: HTTP %d: %s", exc.response.status_code, exc.response.text)
            return 1
        for v in voices:
            logger.info("%s | %s | %s", v["languageCodes"], v["name"], v["ssmlGender"])
        return 0

    try:
        audio_bytes = synthesize_speech(
            args.text,
            api_key,
            language_code=args.lang,
            voice_name=args.voice,
            speaking_rate=args.rate,
        )
        save_audio(audio_bytes, Path(args.output))
        return 0

    except ValueError as exc:
        logger.error("Invalid input: %s", exc)
        return 1
    except TTSRequestError as exc:
        logger.error("TTS request failed: %s", exc)
        return 1
    except Exception:
        logger.exception("Unexpected error during synthesis")
        return 1


if __name__ == "__main__":
    sys.exit(main())