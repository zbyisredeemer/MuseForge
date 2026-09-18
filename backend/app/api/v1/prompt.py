"""Prompt generation API skeleton."""


def generate_prompt(payload: dict) -> dict:
    """Generate a structured beauty prompt from attributes."""
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
