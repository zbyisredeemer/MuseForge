import { useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "../types";

type Props = {
  selectedItem: GalleryItem | null;
  onClearSelection: () => void;
};

const fields = [
  ["style", "Beauty style", "cinematic elegant portrait"],
  ["outfit", "Clothing", "refined contemporary fashion"],
  ["scene", "Scene", "quiet city street at golden hour"],
  ["pose", "Pose / mood", "relaxed confident three-quarter pose"],
  ["camera", "Camera / light", "85mm lens, shallow depth of field, soft cinematic light"],
] as const;

export default function PromptBuilder({ selectedItem, onClearSelection }: Props) {
  const [form, setForm] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(([key,,value]) => [key, value])));
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setPrompt(selectedItem.prompt);
    }
  }, [selectedItem]);

  const generated = useMemo(() => {
    return [
      "A fictional adult woman",
      form.style,
      form.outfit,
      form.scene,
      form.pose,
      form.camera,
      "natural facial proportions, tasteful styling, high detail",
    ].filter(Boolean).join(", ");
  }, [form]);

  const generate = () => setPrompt(generated);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt || generated);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="studio-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PROMPT BUILDER</span>
          <h2>Remix the idea without rewriting from scratch.</h2>
        </div>
        <p>Compose reusable prompt dimensions, then copy the result into your preferred image model.</p>
      </div>

      {selectedItem && (
        <div className="selected-banner">
          <span>Starting from <strong>{selectedItem.title}</strong></span>
          <button onClick={onClearSelection}>Clear reference</button>
        </div>
      )}

      <div className="studio-layout">
        <div className="form-panel">
          {fields.map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <input
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              />
            </label>
          ))}
          <button className="primary-button" onClick={generate}>Generate Prompt</button>
        </div>

        <div className="output-panel">
          <div className="prompt-label"><span>Generated prompt</span><button onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button></div>
          <textarea
            value={prompt || generated}
            onChange={(event) => setPrompt(event.target.value)}
            rows={13}
          />
          <div className="studio-note">
            <strong>Safety baseline</strong>
            <p>MuseForge examples target fictional adult subjects and non-explicit portrait/fashion generation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
