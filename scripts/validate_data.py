"""Validate MuseForge structured datasets against JSON Schema and project invariants."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_schema(data_path: Path, schema_path: Path) -> dict:
    data = load_json(data_path)
    schema = load_json(schema_path)
    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda error: list(error.absolute_path))
    if errors:
        formatted = "\n".join(
            f"- {'/'.join(map(str, error.absolute_path)) or '<root>'}: {error.message}"
            for error in errors
        )
        raise SystemExit(f"{data_path.relative_to(ROOT)} failed schema validation:\n{formatted}")
    return data


def main() -> None:
    gallery_path = ROOT / "dataset/gallery_manifest.json"
    gallery = validate_schema(gallery_path, ROOT / "schemas/gallery.schema.json")
    adapters = validate_schema(
        ROOT / "dataset/model_adapters.json",
        ROOT / "schemas/model_adapters.schema.json",
    )

    if gallery["item_count"] != len(gallery["items"]):
        raise SystemExit("gallery item_count does not match items length")

    ids = [item["id"] for item in gallery["items"]]
    indexes = [item["index"] for item in gallery["items"]]
    if len(ids) != len(set(ids)):
        raise SystemExit("gallery contains duplicate ids")
    if len(indexes) != len(set(indexes)):
        raise SystemExit("gallery contains duplicate indexes")
    if sorted(indexes) != list(range(1, gallery["item_count"] + 1)):
        raise SystemExit("gallery indexes must be continuous from 1..item_count")

    groups = {group["id"]: set(group["categories"]) for group in gallery["category_tree"]}
    for item in gallery["items"]:
        if item["group"] not in groups:
            raise SystemExit(f"unknown group for {item['id']}: {item['group']}")
        if item["category"] not in groups[item["group"]]:
            raise SystemExit(
                f"category/group mismatch for {item['id']}: "
                f"{item['category']} not in {item['group']}"
            )

    adapter_ids = {item["id"] for item in adapters["adapters"]}
    expected_adapters = {"generic", "midjourney", "flux", "stable-diffusion"}
    if adapter_ids != expected_adapters:
        raise SystemExit(
            f"model adapters mismatch: expected {sorted(expected_adapters)}, got {sorted(adapter_ids)}"
        )

    for mirror in (
        ROOT / "web/public/gallery_manifest.json",
        ROOT / "backend/data/gallery_manifest.json",
    ):
        if mirror.read_bytes() != gallery_path.read_bytes():
            raise SystemExit(f"{mirror.relative_to(ROOT)} is not synchronized with dataset/gallery_manifest.json")

    print(
        f"MuseForge data validation OK: {gallery['item_count']} gallery concepts, "
        f"{len(adapter_ids)} model adapters"
    )


if __name__ == "__main__":
    main()
