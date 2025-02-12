from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class NewsCreate(BaseModel):
    title: str
    description: str
    date: date
    link: Optional[str]
    category: str
    ageGroup: str
    isFree: bool
    maxCount: int
    location: str
    images: List[str] = []
    news_type: str