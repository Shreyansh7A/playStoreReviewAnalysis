from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime
from services import review_service
from storage import storage  # Assuming you migrate storage to a Python module
from datetime import datetime

def serialize_datetimes(obj):
    if isinstance(obj, dict):
        return {k: serialize_datetimes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_datetimes(v) for v in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj
router = APIRouter()


class AnalyzeRequest(BaseModel):
    appName: str


@router.post("/reviews/analyze")
async def analyze_app_reviews(req: AnalyzeRequest):
    try:
        appName = req.appName

        # Get app info and reviews
        app_info, reviews = await review_service.get_app_reviews(appName)

        # Analyze sentiment
        analyzed_reviews = await review_service.analyze_sentiment(reviews)

        # Calculate sentiment data
        sentiment_data = review_service.calculate_sentiment_data(analyzed_reviews)

        # Store the analysis result
        analysis_data = {
            "appName": app_info["name"],
            "packageName": app_info["packageName"],
            "developerName": app_info["developer"],
            "appIcon": app_info["icon"],
            "appRating": app_info["rating"],
            "reviewCount": sentiment_data["reviewCount"],
            "averageSentiment": sentiment_data["averageScore"],
            "positivePercentage": sentiment_data["positivePercentage"],
            "negativePercentage": sentiment_data["negativePercentage"],
            "neutralPercentage": sentiment_data["neutralPercentage"],
            "sampleReviews": analyzed_reviews[:10],
        }

        saved_analysis = await storage.create_app_analysis(analysis_data)

        # result = {
        #     "appInfo": app_info,
        #     "sentimentData": sentiment_data,
        #     "reviewSamples": analyzed_reviews[:10],
        # }

        if "createdAt" in saved_analysis and isinstance(saved_analysis["createdAt"], datetime):
            saved_analysis["createdAt"] = saved_analysis["createdAt"].isoformat()

        result = {
            "appInfo": app_info,
            "sentimentData": sentiment_data,
            "reviewSamples": analyzed_reviews[:10],
        }

        return JSONResponse(status_code=200, content=serialize_datetimes(result))

        # return JSONResponse(status_code=200, content=result)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected error occurred while analyzing app reviews")

