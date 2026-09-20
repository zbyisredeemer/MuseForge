"""MuseForge API service entry point."""

import json
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="MuseForge API",
    description="AI Beauty Prompt Engineering API",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

GALLERY_PATH = Path(__file__).resolve().parent / "data" / "gallery_manifest.json"


def load_gallery() -> dict:
    if not GALLERY_PATH.exists():
        raise HTTPException(status_code=500, detail="Gallery manifest is unavailable")
    return json.loads(GALLERY_PATH.read_text(encoding="utf-8"))


@app.get("/health")
def health():
    return {"status": "ok", "service": "museforge"}


@app.get("/api/v1/gallery")
def list_gallery(category: Optional[str] = None, q: Optional[str] = None):
    manifest = load_gallery()
    items = manifest["items"]

    if category:
        items = [item for item in items if item["category"] == category]

    if q:
        needle = q.strip().lower()
        items = [
            item for item in items
            if needle in item["title"].lower()
            or needle in item["category"].lower()
            or any(needle in tag.lower() for tag in item.get("tags", []))
        ]

    return {
        "version": manifest["version"],
        "catalog": manifest["catalog"],
        "count": len(items),
        "items": items,
    }


@app.get("/api/v1/gallery/{item_id}")
def get_gallery_item(item_id: str):
    manifest = load_gallery()
    item = next((item for item in manifest["items"] if item["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@app.post("/api/v1/prompt/generate")
def generate_prompt(payload: dict):
    """MVP prompt generation endpoint."""
    parts = [
        payload.get("subject", "A fictional adult woman"),
        payload.get("beauty_style"),
        payload.get("country"),
        payload.get("clothing"),
        payload.get("scene"),
        payload.get("pose"),
        payload.get("camera"),
    ]
    prompt = ", ".join([item for item in parts if item])
    return {
        "prompt": prompt,
        "negative_prompt": (
            "child, minor, underage, explicit nudity, pornographic, low quality, "
            "blurry, bad anatomy, deformed hands, extra fingers, duplicate person, "
            "distorted face, text, watermark, logo"
        ),
    }
