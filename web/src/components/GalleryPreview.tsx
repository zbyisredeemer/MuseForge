import { useState } from "react";
import type { GalleryItem } from "../types";

const images: Record<string, string> = {
  "01-chinese-hanfu": "/gallery/01_chinese_hanfu.jpg",
  "02-japanese-kimono": "/gallery/02_japanese_kimono.jpg",
  "04-french-elegance": "/gallery/04_french_elegance.jpg",
  "07-indian-sari": "/gallery/07_indian_sari.jpg",
  "10-german-dirndl": "/gallery/10_german_dirndl.jpg",
  "44-cyberpunk": "/gallery/44_cyberpunk.jpg",
};

const accents: Record<string, string> = {
  culture: "linear-gradient(145deg, #4b3025, #17191d 72%)",
  "fashion-lifestyle": "linear-gradient(145deg, #453b30, #17191d 72%)",
  professional: "linear-gradient(145deg, #243342, #17191d 72%)",
  "art-era": "linear-gradient(145deg, #49314d, #17191d 72%)",
  "fantasy-sci-fi": "linear-gradient(145deg, #26304f, #17191d 72%)",
};

export function hasProductionPreview(item: GalleryItem) {
  return Boolean(images[item.id]);
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
  const image = images[item.id];

  if (image && !failed) {
    return (
      <div className={"preview-frame" + (large ? " preview-frame-large" : "")}>
        <img
          className="gallery-image"
          src={image}
          alt={item.title}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={"preview-frame placeholder-preview" + (large ? " preview-frame-large" : "")}
      style={{ background: accents[item.group] ?? "#17191d" }}
    >
      <div className={"placeholder-copy" + (large ? " large" : "")}>
        <span>{String(item.index).padStart(2, "0")}</span>
        <strong>{item.title}</strong>
        <small>{failed ? "Preview unavailable" : "Preview being upgraded"}</small>
      </div>
    </div>
  );
}
