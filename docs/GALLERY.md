# MuseForge Gallery

The MuseForge Gallery is the visual and searchable entry point to the prompt dataset.

## Current catalog

- 100 structured prompt concepts
- 50 concepts with optimized image-backed showcase references
- 50 prompt-first concepts with category placeholders
- 5 category groups
- Search, random discovery, and similarity recommendations

The source of truth is `dataset/gallery_manifest.json`. Copies under `web/public/` and `backend/data/` are validated by CI.

## Category tree

1. **Culture & Heritage** — cultural and historically inspired concepts.
2. **Fashion & Lifestyle** — fashion, seasonal, fitness, nightlife, and everyday editorial concepts.
3. **Professional** — respectful fictional professional portraits.
4. **Art & Era** — illustration, fine-art, and period-inspired visual languages.
5. **Fantasy & Sci-Fi** — fantasy and speculative future concepts.

## Recommendation logic

The current similarity engine is intentionally transparent:

- same category: +5
- same top-level group: +3
- each exact shared tag: +2

This is a deterministic baseline that can later be replaced or complemented by embeddings.

## Web preview asset strategy

Gallery cards should use **individual portrait assets**, not enlarged cells cropped from a catalog sprite. The catalog sprite remains useful for README/docs overviews, but it should not be used as the source for production card previews.

Put individual web previews in:

```text
web/public/gallery/
```

Use the Gallery item id as the filename, replacing hyphens with underscores. Example:

```text
01-chinese-hanfu
        ↓
web/public/gallery/01_chinese_hanfu.webp
```

Preferred image requirements:

- aspect ratio: **4:5**
- recommended: **1024 × 1280**
- hard display floor: **400 × 500**
- Retina-friendly target: **768 × 960**
- preferred format: **WebP**
- JPEG/PNG are supported as fallbacks
- optimize for web delivery without destroying facial or clothing detail

The Web app generates its asset registry automatically before `npm run dev` and `npm run build`:

```bash
cd web
npm run gallery:assets
```

The generator scans `public/gallery/`, prefers WebP when multiple formats share the same id, records intrinsic dimensions, and prints a warning for previews below the minimum resolution. The Web Gallery refuses to stretch assets below 400×500 into portrait cards. For crisp Retina/high-DPI presentation, 768×960 or larger is preferred, with 1024×1280 as the recommended production size. Set `GALLERY_ASSET_STRICT=1` when you want assets below the hard display floor to fail the build.

This means new preview files do not require a hand-maintained React image map.

## Repository asset strategy

Do not commit every full-resolution source generation to Git.

- Keep source/master generations outside the Web bundle or in external object storage when the collection becomes large.
- Commit web-optimized 4:5 previews needed by the public Gallery.
- Keep overview sprite catalogs only for documentation and contact sheets.
- Keep prompts and metadata in JSON, not embedded in image files.
- Prefer deterministic filenames so assets can be generated, validated, and deployed automatically.

## Safety and representation

All human subjects in the Gallery are fictional AI-generated adults. Cultural and geographic tags are creative dimensions, not a claim that a group has one appearance. Contributions should avoid stereotyping, sexualization of minors, explicit sexual content, and misleading real-world uniforms or insignia.
