# MuseForge

> Open-source AI Beauty Prompt Engineering Platform

MuseForge is a structured prompt-engineering project for **AI beauty portrait creation**. It combines visual inspiration, reusable prompt data, a searchable Gallery, a Prompt Studio, and a small FastAPI service.

## Current status

- **100 prompt concepts**
- **50 image-backed showcase concepts**
- **5 top-level category groups**
- Search + category tree
- Random style discovery
- Similar-style recommendation
- Prompt + negative-prompt copy
- Gallery → Studio remix flow
- FastAPI Gallery / recommendation endpoints
- Docker + GitHub Actions CI

## Showcase

![MuseForge 50 Beauty Styles](./assets/showcase/catalog/museforge-50-styles.jpg)

The first 50 concepts use the optimized visual sprite above. Concepts 51–100 are already available as structured prompts and currently use category-themed placeholders in the Web Gallery; dedicated showcase imagery can be added progressively without bloating the repository.

## Category tree

```text
MuseForge
├── Culture & Heritage
├── Fashion & Lifestyle
├── Professional
├── Art & Era
└── Fantasy & Sci-Fi
```

## Quick start

```bash
docker compose up --build
```

Then open:

- Web Studio: http://localhost:3000
- API health: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- Gallery API: http://localhost:8000/api/v1/gallery

## Gallery API

```text
GET /api/v1/gallery
GET /api/v1/gallery?group=fantasy-sci-fi
GET /api/v1/gallery?category=cultural
GET /api/v1/gallery?q=cyber
GET /api/v1/gallery/categories
GET /api/v1/gallery/random
GET /api/v1/gallery/random?category=fantasy
GET /api/v1/gallery/44-cyberpunk
GET /api/v1/gallery/44-cyberpunk/similar?limit=4
POST /api/v1/prompt/generate
```

## Project structure

```text
MuseForge/
├── assets/showcase/     # Optimized visual assets
├── dataset/             # Source-of-truth prompt datasets
├── examples/            # Prompt examples
├── docs/                # Architecture and contribution docs
├── backend/             # FastAPI service
├── app/                 # Prompt engine modules
└── web/                 # React + TypeScript Web Studio
```

## Data model

Each Gallery concept carries:

```text
id / index
title
group / category
tags
adult_subject
has_visual
prompt
negative_prompt
recommended.aspect_ratio
recommended.framing
recommended.lighting
```

See [dataset/gallery_manifest.json](./dataset/gallery_manifest.json).

## Roadmap

- Add dedicated optimized images for concepts 51–100
- Grow to 200+ carefully curated prompt concepts
- Add model adapters for Midjourney, Stable Diffusion, Flux, and other image models
- Add vector similarity search and recommendation explanations
- Add favorites / collections
- Add schema validation and API tests
- Add community submissions and moderation workflow

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md), [DATA_CONTRIBUTION_GUIDE.md](./docs/DATA_CONTRIBUTION_GUIDE.md), and [GALLERY.md](./docs/GALLERY.md).

## Gallery note

Showcase people are fictional AI-generated adults. Cultural or geographic labels are prompt inspiration dimensions rather than claims about how people from a place, culture, or ethnicity look.

## License

MIT License
