import { useEffect, useMemo, useState } from "react";
import type { GalleryItem, GalleryManifest } from "../types";
import GalleryPreview, { hasProductionPreview } from "./GalleryPreview";

type Props = {
  onUsePrompt: (item: GalleryItem) => void;
};

function scoreSimilarity(source: GalleryItem, candidate: GalleryItem) {
  if (source.id === candidate.id) return -1;
  let score = 0;
  if (source.group === candidate.group) score += 3;
  if (source.category === candidate.category) score += 5;
  const sourceTags = new Set(source.tags.map((tag) => tag.toLowerCase()));
  candidate.tags.forEach((tag) => {
    if (sourceTags.has(tag.toLowerCase())) score += 2;
  });
  return score;
}

export default function GalleryV2({ onUsePrompt }: Props) {
  const [manifest, setManifest] = useState<GalleryManifest | null>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/gallery_manifest.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Gallery data failed: ${response.status}`);
        return response.json();
      })
      .then((data: GalleryManifest) => setManifest(data))
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const categories = useMemo(() => {
    if (!manifest) return [];
    const values =
      group === "all"
        ? manifest.items.map((item) => item.category)
        : manifest.category_tree.find((entry) => entry.id === group)?.categories ?? [];
    return Array.from(new Set(values)).sort();
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
        item.tags.some((tag) => tag.toLowerCase().includes(needle));
      return groupMatches && categoryMatches && textMatches;
    });
  }, [manifest, query, group, category]);

  const similarItems = useMemo(() => {
    if (!manifest || !active) return [];
    return manifest.items
      .map((item) => ({ item, score: scoreSimilarity(active, item) }))
      .filter(({ item }) => item.id !== active.id)
      .sort((a, b) => b.score - a.score || a.item.index - b.item.index)
      .slice(0, 4)
      .map(({ item }) => item);
  }, [manifest, active]);

  const selectGroup = (value: string) => {
    setGroup(value);
    setCategory("all");
  };

  const openRandom = () => {
    if (!visibleItems.length) return;
    setActive(visibleItems[Math.floor(Math.random() * visibleItems.length)]);
  };

  const copyPrompt = async () => {
    if (!active) return;
    await navigator.clipboard.writeText(active.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  if (error) return <div className="state-card">Unable to load Gallery: {error}</div>;
  if (!manifest) return <div className="state-card">Loading Gallery…</div>;

  const previewCount = visibleItems.filter(hasProductionPreview).length;

  return (
    <section className="gallery-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PROMPT CATALOG</span>
          <h2>100 styles, one composable prompt system.</h2>
        </div>
        <p>Explore prompt concepts first. High-quality individual previews are published progressively.</p>
      </div>

      <div className="category-tree">
        <button className={group === "all" ? "active" : ""} onClick={() => selectGroup("all")}>
          <strong>All Concepts</strong>
          <span>{manifest.item_count}</span>
          <small>full library</small>
        </button>
        {manifest.category_tree.map((entry) => {
          const count = manifest.items.filter((item) => item.group === entry.id).length;
          return (
            <button key={entry.id} className={group === entry.id ? "active" : ""} onClick={() => selectGroup(entry.id)}>
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

      <div className="result-count">{visibleItems.length} concepts · {previewCount} production previews</div>

      <div className="gallery-grid">
        {visibleItems.map((item, index) => (
          <article className="gallery-card" key={item.id} onClick={() => setActive(item)}>
            <GalleryPreview item={item} eager={index < 5} />
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
            <div className="detail-media"><GalleryPreview item={active} eager large /></div>
            <div className="detail-content">
              <span className="eyebrow">#{String(active.index).padStart(2, "0")} · {active.category.replace("-", " ")}</span>
              <h2>{active.title}</h2>
              <div className="tag-row">{active.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

              <div className="prompt-block">
                <div className="prompt-label">
                  <span>Canonical Prompt</span>
                  <button onClick={copyPrompt}>{copied ? "Copied ✓" : "Copy"}</button>
                </div>
                <p>{active.prompt}</p>
              </div>

              <dl className="settings-grid">
                <div><dt>Aspect</dt><dd>{active.recommended.aspect_ratio}</dd></div>
                <div><dt>Framing</dt><dd>{active.recommended.framing}</dd></div>
                <div><dt>Lighting</dt><dd>{active.recommended.lighting}</dd></div>
              </dl>

              <button className="primary-button" onClick={() => onUsePrompt(active)}>Use in Studio →</button>

              <div className="similar-section">
                <div className="prompt-label"><span>Similar styles</span><small>category + tag matching</small></div>
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
