"""Beauty style API routes.

MuseForge v1 API skeleton.
"""

from typing import List
from fastapi import APIRouter

router = APIRouter(tags=["beauty"])

BEAUTY_STYLES = [
    {
        "name": "Eastern Classical Beauty",
        "tags": ["China", "Hanfu", "Elegant", "Traditional"],
    },
    {
        "name": "French Elegant Beauty",
        "tags": ["France", "Fashion", "Chic"],
    },
    {
        "name": "Japanese Kimono Beauty",
        "tags": ["Japan", "Kimono", "Traditional"],
    },
]


@router.get("/beauty/styles")
def beauty_styles():
    return BEAUTY_STYLES


def list_beauty_styles() -> List[dict]:
    return BEAUTY_STYLES
