from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import generate_insight

router = APIRouter(prefix="/ai", tags=["AI"])

class InsightRequest(BaseModel):
    domain: str
    query: str

@router.post("/insight")
async def get_insight(request: InsightRequest):
    result = generate_insight(request.domain, request.query)
    return result
