# MuseForge Gallery

MuseForge maintains a visual showcase alongside the structured prompt dataset.

![MuseForge 50 Beauty Styles](../assets/showcase/catalog/museforge-50-styles.jpg)

## Catalog

The current catalog contains **50 visual concepts** spanning cultural clothing, modern fashion, seasons, lifestyle, professions, fantasy, and science fiction.

Machine-readable metadata lives in [`dataset/gallery_manifest.json`](../dataset/gallery_manifest.json). Each entry stores its catalog row/column so the catalog can later be rendered as a sprite sheet in the Web Gallery.

## Featured standalone images

The repository also keeps selected standalone previews under `assets/showcase/`:

- Chinese Hanfu Beauty
- Japanese Kimono Beauty
- French Elegant Beauty
- Italian Luxury Beauty
- Fantasy Goddess
- Cyber Beauty

## Asset policy

Showcase assets committed to Git are web-optimized previews rather than full-resolution generation outputs. This keeps clone size under control while preserving enough visual detail for README, documentation, and the Web Gallery.

All people shown in the gallery are fictional AI-generated adults. Cultural and geographic labels are creative prompt dimensions and should not be interpreted as a definition of how people from a culture, country, or ethnicity look.

When contributing a new gallery item, add or update its metadata in `dataset/gallery_manifest.json`, use a descriptive lower-case filename, and keep the preview optimized for the web.
