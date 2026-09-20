# MuseForge Data Standard

MuseForge treats prompt data as a versioned dataset rather than embedding large prompt tables directly in application code.

## Source of truth

- `dataset/gallery_manifest.json` — Gallery concepts and canonical prompts.
- `dataset/model_adapters.json` — Supported model adapter metadata.
- `schemas/gallery.schema.json` — Gallery JSON Schema.
- `schemas/model_adapters.schema.json` — Model adapter JSON Schema.

The Web and API copies of the Gallery manifest are build/runtime mirrors. CI verifies that they are byte-for-byte synchronized with the source dataset.

## Gallery concept

A Gallery concept contains:

```json
{
  "id": "01-chinese-hanfu",
  "index": 1,
  "title": "Chinese Hanfu",
  "group": "culture",
  "category": "cultural",
  "tags": ["China", "Hanfu", "classical", "garden"],
  "adult_subject": true,
  "has_visual": true,
  "catalog_cell": {"row": 1, "column": 1},
  "prompt": "...",
  "negative_prompt": "...",
  "recommended": {
    "aspect_ratio": "4:5",
    "framing": "three-quarter portrait",
    "lighting": "soft cinematic light"
  }
}
```

An item with `has_visual: true` must point either to an individual `image` or to a `catalog_cell` in the sprite catalog.

## Invariants

- IDs and indexes are unique.
- Indexes are continuous from 1 through `item_count`.
- Human subjects are fictional adults.
- Every category belongs to its declared top-level group.
- Prompt text is canonical and model-neutral.
- Provider-specific syntax belongs in the model adapter layer.
- Cultural/geographic tags describe creative inspiration, not a single appearance for a group.

## Validation

Install backend dependencies and run:

```bash
python scripts/validate_data.py
```

The CI workflow runs the same validation on every push and pull request.
