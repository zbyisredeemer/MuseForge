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

- 50-style visual Gallery
- Search and category filters
- Sprite-based catalog cards to keep repository size small
- Prompt / negative-prompt detail modal
- One-click prompt copy
- Send a Gallery concept into the Prompt Studio
- Responsive desktop/mobile UI

The Gallery reads `public/gallery_manifest.json`. The same manifest is also maintained in the repository-level `dataset/gallery_manifest.json`.
