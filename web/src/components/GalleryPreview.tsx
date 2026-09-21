import { useState } from "react";
import type { GalleryItem } from "../types";
import { galleryAssets, galleryAssetQuality } from "../generated/galleryAssets";

const accents: Record<string, string> = {
  culture: "linear-gradient(145deg, #4b3025, #17191d 72%)",
  "fashion-lifestyle": "linear-gradient(145deg, #453b30, #17191d 72%)",
  professional: "linear-gradient(145deg, #243342, #17191d 72%)",
  "art-era": "linear-gradient(145deg, #49314d, #17191d 72%)",
  "fantasy-sci-fi": "linear-gradient(145deg, #26304f, #17191d 72%)",
};

function isAssetReady(item: GalleryItem) {
  const asset = galleryAssets[item.id];
  if (!asset) return false;

  // Unknown dimensions (for example WebP) are allowed through. The build-time
  // asset generator still prefers WebP and can enforce strict validation when
  // desired. Known undersized JPEG/PNG previews are intentionally hidden so the
  // production Gallery never stretches tiny source images into blurry cards.
  if (!asset.width || !asset.height) return true;

  return (
    asset.width >= galleryAssetQuality.minimumWidth &&
    asset.height >= galleryAssetQuality.minimumHeight
  );
}

export function hasProductionPreview(item: GalleryItem) {
  return isAssetReady(item);
}

export default function GalleryPreview({
  item,
  eager = false,
  large = false,
}: {
  item: GalleryItem;
  eager?: boolean;
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const asset = galleryAssets[item.id];
  const ready = isAssetReady(item);

  if (asset && ready && !failed) {
    return (
      <div className={"preview-frame" + (large ? " preview-frame-large" : "")}>
        <img
          className="gallery-image"
          src={asset.src}
          alt={item.title}
          width={asset.width || undefined}
          height={asset.height || undefined}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  const status = failed
    ? "Preview unavailable"
    : asset && !ready
      ? "HD preview pending"
      : "Preview being upgraded";

  return (
    <div
      className={"preview-frame placeholder-preview" + (large ? " preview-frame-large" : "")}
      style={{ background: accents[item.group] ?? "#17191d" }}
    >
      <div className={"placeholder-copy" + (large ? " large" : "")}>
        <span>{String(item.index).padStart(2, "0")}</span>
        <strong>{item.title}</strong>
        <small>{status}</small>
      </div>
    </div>
  );
}
