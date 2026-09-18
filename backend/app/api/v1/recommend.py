"""Beauty recommendation API module."""

from backend.app.services.recommendation_service import recommend


def recommend_beauty(payload: dict) -> dict:
    keyword = payload.get("keyword", "")
    return recommend(keyword)
