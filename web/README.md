# MuseForge Web

React + TypeScript + Vite frontend for the MuseForge Beauty Prompt Studio.

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- 100-concept searchable Gallery
- Five top-level category groups
- Random discovery and similar-style recommendations
- Individual production preview images with lazy loading
- Graceful placeholders for concepts whose dedicated preview is still being upgraded
- Gallery → Prompt Studio remix flow
- Generic / Midjourney / FLUX / Stable Diffusion prompt adapters
- Responsive desktop/mobile UI

## Image strategy

The deployed Gallery no longer enlarges the low-resolution legacy sprite for production cards. Published previews live under `public/gallery/` and are rendered with native `<img>` elements using lazy loading and async decoding.

The 50-style sprite remains useful as a compact repository overview, but new Web Gallery previews should be added as individual optimized JPEG/WebP assets.

## Data

The Gallery reads `public/gallery_manifest.json`. The source-of-truth copy remains `../dataset/gallery_manifest.json`.
