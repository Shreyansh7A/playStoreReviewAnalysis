from fastapi import APIRouter
from controllers import review_controller

router = APIRouter()

# Map the original Express routes
router.post("/reviews/analyze")(review_controller.analyze_app_reviews)
