# MuseForge Beauty Prompt Data Standard

## Overview

All beauty prompt entries should follow a structured schema.

```json
{
  "id": "unique_id",
  "tags": [],
  "beauty_style": "",
  "country": "",
  "clothing": "",
  "scene": "",
  "pose": "",
  "makeup": "",
  "camera": "",
  "lighting": "",
  "prompt": "",
  "negative_prompt": ""
}
```

## Design Principles

- Separate visual attributes from generated prompt text.
- Keep every attribute reusable.
- Support Midjourney, Stable Diffusion and Flux style output.
- Prefer descriptive visual language over model-specific keywords.
