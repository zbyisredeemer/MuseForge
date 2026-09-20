# MuseForge

> Open-source AI Beauty Prompt Engineering Platform

MuseForge focuses on one thing: **building better prompts for AI beauty portrait creation**.

It combines structured beauty attributes, cultural and fashion references, clothing, scenes, seasons, poses, lighting, camera language, and reusable prompt examples into an open dataset and prompt-generation toolkit.

## Showcase

![MuseForge 50 Beauty Styles](./assets/showcase/catalog/museforge-50-styles.jpg)

The gallery currently organizes **50 beauty concepts** across cultural fashion, modern style, seasonal scenes, professional portraits, lifestyle, fantasy, and science fiction.

| Chinese Hanfu | Japanese Kimono | French Elegance |
| --- | --- | --- |
| ![](./assets/showcase/chinese_hanfu_beauty.jpg) | ![](./assets/showcase/japanese_kimono_beauty.jpg) | ![](./assets/showcase/french_elegant_beauty.jpg) |

| Italian Luxury | Fantasy Goddess | Cyber Beauty |
| --- | --- | --- |
| ![](./assets/showcase/italian_luxury_beauty.jpg) | ![](./assets/showcase/fantasy_goddess.jpg) | ![](./assets/showcase/cyber_beauty.jpg) |

See the [Gallery Guide](./docs/GALLERY.md) and the machine-readable [Gallery Manifest](./dataset/gallery_manifest.json).

## Core dimensions

- Countries, regions, and cultural references
- Beauty styles and appearance attributes
- Hairstyles and makeup
- Clothing and accessories
- Seasons, environments, and scenes
- Poses, expressions, and moods
- Photography, lenses, composition, and lighting
- Fantasy, illustration, and sci-fi styles
- Prompt generation and recommendation

## Vision

Build an open, structured knowledge base for AI beauty prompt engineering: easy to browse, easy to combine, easy to extend, and useful across image-generation models.

## Project structure

```text
MuseForge/
├── assets/showcase/     # Web-optimized gallery previews
├── dataset/             # Structured beauty/prompt datasets
├── examples/            # Prompt examples
├── docs/                # Architecture and contribution docs
├── backend/             # API service
├── app/                 # Prompt engine modules
└── web/                 # Web Studio
```

## Roadmap

- Expand the gallery and prompt dataset
- Connect Dataset Loader to all APIs
- Complete the Web Studio and Gallery
- Add recommendation and search
- Add model-specific output for Midjourney, Stable Diffusion, Flux, and other image models
- Improve schema validation and automated testing

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and [DATA_CONTRIBUTION_GUIDE.md](./docs/DATA_CONTRIBUTION_GUIDE.md).

## Gallery note

Showcase people are fictional AI-generated adults. Cultural or geographic labels are prompt inspiration dimensions rather than claims about how people from a place or culture look.

## License

MIT License
