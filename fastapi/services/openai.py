import os
import json
import logging
from openai import AsyncOpenAI
from dotenv import load_dotenv
import re


load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "sk-placeholder-key"))

# Extract only the JSON block
def extract_json(raw: str) -> str:
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
    return raw.strip()


async def analyze_sentiment(text: str) -> dict:
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a sentiment analysis expert. Respond ONLY with strict JSON like: { \"sentiment\": ..., \"score\": ..., \"confidence\": ... }. "
"The `score` must always be a float between 0.0 and 1.0 representing sentiment intensity, if the score is negative, do not score it more than 25"
                    )
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0
        )

        # raw = response.choices[0].message.content.strip()
        raw = response.choices[0].message.content.strip()
        clean = extract_json(raw)

        try:
            data = json.loads(clean)
        except json.JSONDecodeError:
            logging.error(f"OpenAI returned invalid JSON: {raw}")
            raise RuntimeError("OpenAI response was not valid JSON")

        # try:
        #     data = json.loads(raw)
        # except json.JSONDecodeError:
        #     logging.error(f"OpenAI returned invalid JSON: {raw}")
        #     raise RuntimeError("OpenAI response was not valid JSON")

        # Basic validation
        if not all(k in data for k in ("sentiment", "score", "confidence")):
            raise ValueError(f"Incomplete response: {data}")

        return {
            "sentiment": str(data["sentiment"]),
            "score": max(0, min(100, round(float(data["score"]) * 100))),
            "confidence": max(0.0, min(1.0, float(data["confidence"])))
        }

        

    except Exception as e:
        logging.error(f"OpenAI API failed: {e}")
        raise RuntimeError("Failed to analyze sentiment")
