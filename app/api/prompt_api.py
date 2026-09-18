"""
MuseForge Prompt API

REST endpoints for AI beauty prompt generation.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/prompt", tags=["prompt"])


class PromptRequest(BaseModel):
    country: str | None = None
    beauty_style: str | None = None
    clothing: str | None = None
    hairstyle: str | None = None
    makeup: str | None = None
    scene: str | None = None
    pose: str | None = None
    camera: str | None = None


@router.post("/generate")
def generate_prompt(request: PromptRequest):
    """Generate an AI beauty portrait prompt."""
    prompt = ", ".join(
        filter(None, [
            request.country,
            request.beauty_style,
            request.clothing,
            request.hairstyle,
            request.makeup,
            request.scene,
            request.pose,
            request.camera,
        ])
    )

    return {
        "prompt": f"A beautiful woman, {prompt}, cinematic photography, ultra realistic, high detail",
        "negative_prompt": "low quality, blurry, distorted face, bad anatomy",
        "tags": request.model_dump()
    }
