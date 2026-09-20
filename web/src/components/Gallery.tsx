import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { GalleryItem, GalleryManifest } from "../types";

type Props = {
  onUsePrompt: (item: GalleryItem) => void;
};

const catalogUrl = "/assets/museforge-50-styles.jpg";

const groupAccent: Record<string, string> = {
  culture: "linear-gradient(145deg, #4b3025, #17191d 72%)",
  "fashion-lifestyle": "linear-gradient(145deg, #453b30, #17191d 72%)",
  professional: "linear-gradient(145deg, #243342, #17191d 72%)",
  "art-era": "linear-gradient(145deg, #49314d, #17191d 72%)",
  "fantasy-sci-fi": "linear-gradient(145deg, #26304f, #17191d 72%)",
};

function previewStyle(item: GalleryItem, manifest: GalleryManifest): CSSProperties {
  if (item.has_visual && item.catalog_cell) {
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
  return {
    background: groupAccent[item.group] || "linear-gradient(145deg, #303139, #17191d)",
  };
}

function scoreSimilarity(source: GalleryItem, candidate: GalleryItem) {
  if (source.id === candidate.id) return -1;
  let score = 0;
  if (source.group === candidate.group) score += 3;
  if (source.category === candidate.category) score += 5;
  const sourceTags = new Set(source.tags.map((tag) => tag.toLowerCase()));
  for (const tag of candidate.tags) {
    if (sourceTags.has(tag.toLowerCase())) score += 2;
  }
  return score;
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export default function Gallery({ onUsePrompt }: Props) {
  const [manifest, setManifest] = useState<GalleryManifest | null>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
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
    const allowed =
      group === "all"
        ? new Set(manifest.items.map((item) => item.category))
        : new Set(manifest.category_tree.find((entry) => entry.id === group)?.categories ?? []);
    return Array.from(allowed).sort();
  }, [manifest, group]);

  const visibleItems = useMemo(() => {
    if (!manifest) return [];
    const needle = query.trim().toLowerCase();
    return manifest.items.filter((item) => {
      const groupMatches = group === "all" || item.group === group;
      const categoryMatches = category === "all" || item.category === category;
      const textMatches =
        !needle ||
        item.title.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle) ||
        item.group.toLowerCase().includes(needle) ||
        item.tags.some((tag) => tag.toLowerCase().includes(needle));
      return groupMatches && categoryMatches && textMatches;
    });
  }, [manifest, query, group, category]);

  const similarItems = useMemo(() => {
    if (!manifest || !active) return [];
    return manifest.items
      .map((item) => ({ item, score: scoreSimilarity(active, item) }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score || a.item.index - b.item.index)
      .slice(0, 4)
      .map((entry) => entry.item);
  }, [manifest, active]);

  const chooseGroup = (nextGroup: string) => {
    setGroup(nextGroup);
    setCategory("all");
  };

  const openRandom = () => {
    if (!visibleItems.length) return;
    const item = visibleItems[Math.floor(Math.random() * visibleItems.length)];
    setActive(item);
  };

  const handleCopy = async (kind: "prompt" | "negative", value: string) => {
    await copyText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  };

  if (error) return <div className="state-card">Unable to load the gallery: {error}</div>;
  if (!manifest) return <div className="state-card">Loading gallery…</div>;

  return (
    <section className="gallery-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PROMPT CATALOG</span>
          <h2>100 styles, one composable prompt system.</h2>
        </div>
        <p>{manifest.safety.note}</p>
      </div>

      <div className="category-tree">
        <button className={group === "all" ? "active" : ""} onClick={() => chooseGroup("all")}>
          <strong>All Concepts</strong>
          <span>{manifest.item_count}</span>
        </button>
        {manifest.category_tree.map((entry) => {
          const count = manifest.items.filter((item) => item.group === entry.id).length;
          return (
            <button key={entry.id} className={group === entry.id ? "active" : ""} onClick={() => chooseGroup(entry.id)}>
              <strong>{entry.label}</strong>
              <span>{count}</span>
              <small>{entry.categories.join(" · ").replaceAll("-", " ")}</small>
            </button>
          );
        })}
      </div>

      <div className="gallery-toolbar">
        <label className="search-box">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search styles, tags, scenes…" />
        </label>
        <div className="filter-row">
          <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All</button>
          {categories.map((value) => (
            <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>
              {value.replace("-", " ")}
            </button>
          ))}
        </div>
        <button className="random-button" onClick={openRandom}>↻ Random style</button>
      </div>

      <div className="result-count">
        {visibleItems.length} concepts · {visibleItems.filter((item) => item.has_visual).length} with image previews
      </div>

      <div className="gallery-grid">
        {visibleItems.map((item) => (
          <article className="gallery-card" key={item.id} onClick={() => setActive(item)}>
            <div className={"sprite-preview" + (item.has_visual ? "" : " placeholder-preview")} style={previewStyle(item, manifest)} role="img" aria-label={item.title}>
              {!item.has_visual && (
                <div className="placeholder-copy">
                  <span>{String(item.index).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <small>Prompt concept</small>
                </div>
              )}
            </div>
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
              <div className={"sprite-preview detail-sprite" + (active.has_visual ? "" : " placeholder-preview")} style={previewStyle(active, manifest)}>
                {!active.has_visual && (
                  <div className="placeholder-copy large">
                    <span>{String(active.index).padStart(2, "0")}</span>
                    <strong>{active.title}</strong>
                    <small>Dedicated showcase image pending</small>
                  </div>
                )}
              </div>
            </div>
            <div className="detail-content">
              <span className="eyebrow">#{String(active.index).padStart(2, "0")} · {active.category.replace("-", " ")}</span>
              <h2>{active.title}</h2>
              <div className="tag-row">{active.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

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

              <div className="similar-section">
                <div className="prompt-label"><span>Similar styles</span><small>tag + category matching</small></div>
                <div className="similar-grid">
                  {similarItems.map((item) => (
                    <button key={item.id} onClick={() => setActive(item)}>
                      <span>{String(item.index).padStart(2, "0")}</span>
                      <strong>{item.title}</strong>
                      <small>{item.category.replace("-", " ")}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
