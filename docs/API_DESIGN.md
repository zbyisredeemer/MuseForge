# MuseForge API Design

## Overview

MuseForge provides APIs for AI beauty prompt generation.

## Endpoints

### Generate Prompt

POST /api/v1/prompt/generate

Request:

```json
{
  "country":"China",
  "style":"Eastern Classical Beauty",
  "clothing":"Hanfu",
  "scene":"Autumn Garden"
}
```

Response:

```json
{
  "prompt":"generated beauty prompt",
  "negative_prompt":"quality constraints",
  "score":90
}
```

## Future APIs

- GET /api/v1/beauty/styles
- GET /api/v1/beauty/recommend
- POST /api/v1/prompt/score
