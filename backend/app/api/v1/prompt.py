"""Prompt generation API routes."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["prompt"])


class PromptRequest(BaseModel):
    country: str = "China"
    style: str = "Eastern Classical Beauty"
    clothing: str = "Hanfu"
    scene: str = "Autumn Garden"
    camera: str = "85mm cinematic"


def generate_prompt(payload: dict) -> dict:
    parts = [
        payload.get("style"),
        payload.get("country"),
        payload.get("clothing"),
        payload.get("scene"),
        payload.get("camera"),
    ]

    prompt = ", ".join([p for p in parts if p])

    return {
        "prompt": prompt,
        "negative_prompt": "low quality, blurry, bad anatomy",
        "tags": payload,
    }


@router.post("/prompt/generate")
def prompt_generate(request: PromptRequest):
    return generate_prompt(request.model_dump())
