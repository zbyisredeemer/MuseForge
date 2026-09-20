import { useState } from "react";
import Gallery from "./components/Gallery";
import PromptBuilder from "./components/PromptBuilder";
import type { GalleryItem } from "./types";

type View = "gallery" | "studio";

export default function App() {
  const [view, setView] = useState<View>("gallery");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const useInStudio = (item: GalleryItem) => {
    setSelectedItem(item);
    setView("studio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setView("gallery"); }}>
          <span className="brand-mark">M</span>
          <span>
            <strong>MuseForge</strong>
            <small>Beauty Prompt Studio</small>
          </span>
        </a>
        <nav className="nav-tabs" aria-label="Primary">
          <button className={view === "gallery" ? "active" : ""} onClick={() => setView("gallery")}>Gallery</button>
          <button className={view === "studio" ? "active" : ""} onClick={() => setView("studio")}>Studio</button>
          <a href="https://github.com/zbyisredeemer/MuseForge" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div>
            <span className="eyebrow">OPEN-SOURCE PROMPT ENGINEERING</span>
            <h1>Explore a visual language for AI beauty portraits.</h1>
            <p>
              Browse 50 curated concepts, inspect their prompt structure, and send any style directly
              into the Studio for remixing.
            </p>
          </div>
          <div className="hero-stats">
            <div><strong>50</strong><span>visual concepts</span></div>
            <div><strong>10+</strong><span>style categories</span></div>
            <div><strong>1 click</strong><span>to copy prompts</span></div>
          </div>
        </section>

        {view === "gallery" ? (
          <Gallery onUsePrompt={useInStudio} />
        ) : (
          <PromptBuilder selectedItem={selectedItem} onClearSelection={() => setSelectedItem(null)} />
        )}
      </main>

      <footer>
        <span>MuseForge · MIT License</span>
        <span>Fictional AI-generated adult subjects only.</span>
      </footer>
    </div>
  );
}
