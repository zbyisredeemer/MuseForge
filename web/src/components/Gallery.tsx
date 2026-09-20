import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { GalleryItem, GalleryManifest } from "../types";

type Props = {
  onUsePrompt: (item: GalleryItem) => void;
};

const catalogUrl = "/assets/museforge-50-styles.jpg";

function spriteStyle(item: GalleryItem, manifest: GalleryManifest): CSSProperties {
  const columns = manifest.catalog.columns;
  const rows = manifest.catalog.rows;
  const x = columns <= 1 ? 0 : ((item.catalog_cell.column - 1) / (columns - 1)) * 100;
  const y = rows <= 1 ? 0 : ((item.catalog_cell.row - 1) / (rows - 1)) * 100;
  return {
    backgroundImage: `url("${catalogUrl}")`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
  };
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export default function Gallery({ onUsePrompt }: Props) {
  const [manifest, setManifest] = useState<GalleryManifest | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [copied, setCopied] = useState<"prompt" | "negative" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/gallery_manifest.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Gallery manifest failed: ${response.status}`);
        return response.json();
      })
      .then((data: GalleryManifest) => setManifest(data))
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const categories = useMemo(() => {
    if (!manifest) return [];
    return Array.from(new Set(manifest.items.map((item) => item.category))).sort();
  }, [manifest]);

  const visibleItems = useMemo(() => {
    if (!manifest) return [];
    const needle = query.trim().toLowerCase();
    return manifest.items.filter((item) => {
      const categoryMatches = category === "all" || item.category === category;
      const textMatches =
        !needle ||
        item.title.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle) ||
        item.tags.some((tag) => tag.toLowerCase().includes(needle));
      return categoryMatches && textMatches;
    });
  }, [manifest, query, category]);

  const handleCopy = async (kind: "prompt" | "negative", value: string) => {
    await copyText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  };

  if (error) {
    return <div className="state-card">Unable to load the gallery: {error}</div>;
  }
  if (!manifest) {
    return <div className="state-card">Loading gallery…</div>;
  }

  return (
    <section className="gallery-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">VISUAL CATALOG</span>
          <h2>50 styles, one composable prompt system.</h2>
        </div>
        <p>{manifest.safety.note}</p>
      </div>

      <div className="gallery-toolbar">
        <label className="search-box">
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search styles, tags, scenes…"
          />
        </label>
        <div className="filter-row">
          <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>
            All
          </button>
          {categories.map((value) => (
            <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>
              {value.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="result-count">{visibleItems.length} concepts</div>

      <div className="gallery-grid">
        {visibleItems.map((item) => (
          <article className="gallery-card" key={item.id} onClick={() => setActive(item)}>
            <div className="sprite-preview" style={spriteStyle(item, manifest)} role="img" aria-label={item.title} />
            <div className="card-body">
              <div className="card-index">{String(item.index).padStart(2, "0")}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.category.replace("-", " ")}</p>
              </div>
            </div>
            <div className="tag-row">
              {item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="modal-backdrop" onMouseDown={() => setActive(null)}>
          <article className="detail-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setActive(null)} aria-label="Close">×</button>
            <div className="detail-media">
              <div className="sprite-preview detail-sprite" style={spriteStyle(active, manifest)} />
            </div>
            <div className="detail-content">
              <span className="eyebrow">#{String(active.index).padStart(2, "0")} · {active.category.replace("-", " ")}</span>
              <h2>{active.title}</h2>
              <div className="tag-row">
                {active.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>

              <div className="prompt-block">
                <div className="prompt-label"><span>Prompt</span><button onClick={() => handleCopy("prompt", active.prompt)}>{copied === "prompt" ? "Copied ✓" : "Copy"}</button></div>
                <p>{active.prompt}</p>
              </div>

              <div className="prompt-block negative">
                <div className="prompt-label"><span>Negative Prompt</span><button onClick={() => handleCopy("negative", active.negative_prompt)}>{copied === "negative" ? "Copied ✓" : "Copy"}</button></div>
                <p>{active.negative_prompt}</p>
              </div>

              <dl className="settings-grid">
                <div><dt>Aspect</dt><dd>{active.recommended.aspect_ratio}</dd></div>
                <div><dt>Framing</dt><dd>{active.recommended.framing}</dd></div>
                <div><dt>Lighting</dt><dd>{active.recommended.lighting}</dd></div>
              </dl>

              <button className="primary-button" onClick={() => onUsePrompt(active)}>Use in Studio →</button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
