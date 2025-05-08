from typing import Optional, Dict, List, TypedDict, Literal
from datetime import datetime

class AppAnalysis(TypedDict):
    id: int
    appName: str
    packageName: str
    developerName: str
    appIcon: str
    appRating: str
    reviewCount: int
    averageSentiment: int
    positivePercentage: int
    negativePercentage: int
    neutralPercentage: int
    sampleReviews: List[Dict]
    createdAt: datetime

class InsertAppAnalysis(TypedDict):
    appName: str
    packageName: str
    developerName: str
    appIcon: str
    appRating: str
    reviewCount: int
    averageSentiment: int
    positivePercentage: int
    negativePercentage: int
    neutralPercentage: int
    sampleReviews: List[Dict]


class MemStorage:
    def __init__(self):
        self.users: Dict[int, User] = {}
        self.app_analyses: Dict[int, AppAnalysis] = {}
        self.user_current_id = 1
        self.analysis_current_id = 1

    # App analysis methods
    async def create_app_analysis(self, data: InsertAppAnalysis) -> AppAnalysis:
        analysis_id = self.analysis_current_id
        self.analysis_current_id += 1
        now = datetime.now()

        analysis: AppAnalysis = {
            "id": analysis_id,
            "createdAt": now,
            **data,
        }
        self.app_analyses[analysis_id] = analysis
        return analysis

    async def get_app_analysis(self, id: int) -> Optional[AppAnalysis]:
        return self.app_analyses.get(id)


# Singleton instance
storage = MemStorage()
