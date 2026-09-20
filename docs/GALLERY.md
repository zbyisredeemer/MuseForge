# MuseForge Gallery

The MuseForge Gallery is the visual and searchable entry point to the prompt dataset.

## Current catalog

- 100 structured prompt concepts
- 50 concepts with optimized image previews
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

## Asset strategy

Do not commit every full-resolution generation to Git.

- Keep web-optimized showcase previews in `assets/showcase/`.
- Use sprite catalogs for large batches.
- Add individual assets for high-value featured examples.
- Keep prompts and metadata in JSON, not embedded in image files.

## Safety and representation

All human subjects in the Gallery are fictional AI-generated adults. Cultural and geographic tags are creative dimensions, not a claim that a group has one appearance. Contributions should avoid stereotyping, sexualization of minors, explicit sexual content, and misleading real-world uniforms or insignia.
