import logging
from datetime import datetime
from typing import List, Dict, Tuple, Optional
from google_play_scraper import app, reviews, search, Sort
from services.openai import analyze_sentiment as openai_analyze_sentiment
import asyncio
import aiohttp
from functools import partial
import time

# Rate limiting using a semaphore (5 concurrent tasks max)
sem = asyncio.Semaphore(5)

async def get_app_reviews(app_name_or_id: str) -> Tuple[Dict, List[Dict]]:
    try:
        app_id = app_name_or_id

        # Determine if input is a package name
        if '.' not in app_name_or_id:
            search_result = search(app_name_or_id, lang='en', country='us')
            if not search_result:
                raise ValueError(f"No app found with name: {app_name_or_id}")
            app_id = search_result[0]['appId']

        app_details = app(app_id)
        result_reviews, _ = reviews(app_id, lang='en', country='us', sort=Sort.NEWEST, count=100)

        app_info = {
            "name": app_details['title'],
            "packageName": app_details['appId'],
            "developer": app_details['developer'],
            "icon": app_details['icon'],
            "rating": str(app_details['score']),
        }

        return app_info, result_reviews
    except Exception as e:
        logging.error("Error fetching app reviews: %s", e)
        raise RuntimeError(f"Failed to fetch app reviews: {e}")


async def _process_review(review: Dict) -> Optional[Dict]:
    if not review.get("content", "").strip():
        return None

    try:
        async with sem:
            start = time.time()
            logging.info(f"[START] Processing review {review['reviewId']} at {start:.2f}")
            sentiment_result = await openai_analyze_sentiment(review["content"])
            end = time.time()
            logging.info(f"[DONE ] Review {review['reviewId']} finished at {end:.2f} (duration: {end - start:.2f}s)")

         
        return {
            "id": review.get("reviewId"),
            "userName": review.get("userName"),
            "userImage": review.get("userImage"),
            "content": review.get("content"),
            "score": review.get("score"),
            "thumbsUpCount": review.get("thumbsUpCount"),
            "reviewCreatedVersion": review.get("reviewCreatedVersion"),
            "at": review.get("at"),
            "replyContent": review.get("replyContent"),
            "replyAt": review.get("repliedAt"),
            "sentiment": sentiment_result["sentiment"],
            "sentimentScore": sentiment_result["score"],
        }

    except Exception as e:
        logging.warning(f"Failed to analyze sentiment for review {review.get('reviewId')}: {e}")
        return {
            "id": review.get("reviewId"),
            "userName": review.get("userName"),
            "userImage": review.get("userImage"),
            "content": review.get("content"),
            "score": review.get("score"),
            "thumbsUpCount": review.get("thumbsUpCount"),
            "reviewCreatedVersion": review.get("reviewCreatedVersion"),
            "at": review.get("at"),
            "replyContent": review.get("replyContent"),
            "replyAt": review.get("repliedAt"),
            "sentiment": "neutral",
            "sentimentScore": 50,
        }


async def analyze_sentiment(reviews: List[Dict]) -> List[Dict]:
    tasks = [_process_review(review) for review in reviews]
    results = await asyncio.gather(*tasks)
    return [res for res in results if res is not None]


def calculate_sentiment_data(reviews: List[Dict]) -> Dict:
    review_count = len(reviews)
    if review_count == 0:
        return {
            "averageScore": 0,
            "reviewCount": 0,
            "date": datetime.now().strftime("%b %d, %Y"),
            "positivePercentage": 0,
            "negativePercentage": 0,
            "neutralPercentage": 0,
        }

    total_score = 0
    pos = neg = neu = 0

    for r in reviews:
        score = r.get("sentimentScore", 50)
        if score == 0:
            score = 50
        print(f"Score: {score}")
        total_score += score
        sentiment = r.get("sentiment")
        if sentiment == "positive":
            pos += 1
        elif sentiment == "negative":
            neg += 1
        else:
            neu += 1

    avg = round(total_score / review_count)
    pos_pct = round((pos / review_count) * 100)
    neg_pct = round((neg / review_count) * 100)
    neu_pct = 100 - pos_pct - neg_pct

    return {
        "averageScore": avg,
        "reviewCount": review_count,
        "date": datetime.now().strftime("%b %d, %Y"),
        "positivePercentage": pos_pct,
        "negativePercentage": neg_pct,
        "neutralPercentage": neu_pct,
    }
