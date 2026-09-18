"""MuseForge API service entry point."""

from fastapi import FastAPI

app = FastAPI(
    title="MuseForge API",
    description="AI Beauty Prompt Engineering API",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "museforge"}


@app.post("/api/v1/prompt/generate")
def generate_prompt(payload: dict):
    """MVP prompt generation endpoint."""
    parts = [
        payload.get("beauty_style"),
        payload.get("country"),
        payload.get("clothing"),
        payload.get("scene"),
        payload.get("camera"),
    ]
    prompt = ", ".join([item for item in parts if item])
    return {
        "prompt": prompt,
        "negative_prompt": "low quality, blurry, bad anatomy",
    }
