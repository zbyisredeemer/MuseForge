"""MuseForge API service entry point."""

import json
import random
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="MuseForge API",
    description="AI Beauty Prompt Engineering API",
    version="0.3.0",
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


def filter_items(items: list[dict], category: Optional[str], group: Optional[str], q: Optional[str]) -> list[dict]:
    if category:
        items = [item for item in items if item["category"] == category]
    if group:
        items = [item for item in items if item.get("group") == group]
    if q:
        needle = q.strip().lower()
        items = [
            item for item in items
            if needle in item["title"].lower()
            or needle in item["category"].lower()
            or needle in item.get("group", "").lower()
            or any(needle in tag.lower() for tag in item.get("tags", []))
        ]
    return items


def similarity_score(source: dict, candidate: dict) -> int:
    if source["id"] == candidate["id"]:
        return -1
    score = 0
    if source.get("group") == candidate.get("group"):
        score += 3
    if source["category"] == candidate["category"]:
        score += 5
    source_tags = {tag.lower() for tag in source.get("tags", [])}
    score += sum(2 for tag in candidate.get("tags", []) if tag.lower() in source_tags)
    return score


@app.get("/health")
def health():
    return {"status": "ok", "service": "museforge", "version": "0.3.0"}


@app.get("/api/v1/gallery")
def list_gallery(category: Optional[str] = None, group: Optional[str] = None, q: Optional[str] = None):
    manifest = load_gallery()
    items = filter_items(manifest["items"], category, group, q)
    return {
        "version": manifest["version"],
        "total": manifest["item_count"],
        "count": len(items),
        "category_tree": manifest["category_tree"],
        "items": items,
    }


@app.get("/api/v1/gallery/categories")
def gallery_categories():
    manifest = load_gallery()
    return {"groups": manifest["category_tree"]}


@app.get("/api/v1/gallery/random")
def random_gallery_item(category: Optional[str] = None, group: Optional[str] = None):
    manifest = load_gallery()
    items = filter_items(manifest["items"], category, group, None)
    if not items:
        raise HTTPException(status_code=404, detail="No gallery concepts match the requested filters")
    return random.choice(items)


@app.get("/api/v1/gallery/{item_id}/similar")
def similar_gallery_items(item_id: str, limit: int = 4):
    manifest = load_gallery()
    source = next((item for item in manifest["items"] if item["id"] == item_id), None)
    if not source:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    safe_limit = max(1, min(limit, 12))
    ranked = sorted(
        (
            (similarity_score(source, candidate), candidate)
            for candidate in manifest["items"]
            if candidate["id"] != source["id"]
        ),
        key=lambda entry: (-entry[0], entry[1]["index"]),
    )
    return {"source": source["id"], "items": [candidate for _, candidate in ranked[:safe_limit]]}


@app.get("/api/v1/gallery/{item_id}")
def get_gallery_item(item_id: str):
    manifest = load_gallery()
    item = next((item for item in manifest["items"] if item["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@app.post("/api/v1/prompt/generate")
def generate_prompt(payload: dict):
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
