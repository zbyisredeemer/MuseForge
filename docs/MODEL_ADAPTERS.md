# Prompt Model Adapters

MuseForge stores a **canonical prompt** first, then adapts that prompt for the target image-generation workflow.

## Supported adapters

| Adapter | Output strategy | Negative prompt |
| --- | --- | --- |
| `generic` | Portable natural-language baseline | Separate |
| `midjourney` | Adds portable `--ar`, `--stylize`, and `--no` parameters | Folded into `--no` |
| `flux` | Expands into descriptive natural-language instructions | Folded into instruction |
| `stable-diffusion` | Adds common quality cues and inference hints | Separate |

No provider model version is pinned. Model versions, checkpoints, UIs, and hosted implementations change independently, so the adapters expose **portable starting points** rather than pretending one parameter set is universally optimal.

## Architecture

```text
Gallery / Prompt Builder
        ↓
Canonical MuseForge Prompt
        ↓
Prompt Adapter
   ┌────┼─────────┬──────────────┐
Generic MJ       FLUX            SD
```

## API

### List adapters

```http
GET /api/v1/prompt/models
```

### Adapt one prompt

```http
POST /api/v1/prompt/adapt
Content-Type: application/json

{
  "model": "midjourney",
  "prompt": "A fictional adult woman, elegant Hanfu, cinematic garden portrait",
  "negative_prompt": "blurry, bad anatomy, watermark",
  "aspect_ratio": "4:5"
}
```

### Adapt to every supported target

```http
POST /api/v1/prompt/adapt-all
```

### Generate and adapt

```http
POST /api/v1/prompt/generate

{
  "beauty_style": "French elegant portrait",
  "clothing": "black evening dress",
  "scene": "Paris cafe at blue hour",
  "camera": "85mm lens, shallow depth of field",
  "model": "flux",
  "aspect_ratio": "4:5"
}
```

## Design principle

Adapters must be deterministic, readable, and provider-version-agnostic. Keep model-specific magic small enough that users can understand what MuseForge changed.
