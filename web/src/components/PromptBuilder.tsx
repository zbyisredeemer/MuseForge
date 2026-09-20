import { useEffect, useMemo, useState } from "react";
import { adaptPrompt, PROMPT_MODELS } from "../lib/modelAdapters";
import type { GalleryItem, PromptModel } from "../types";

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

const defaultNegative =
  "child, minor, underage, explicit nudity, pornographic, low quality, blurry, bad anatomy, deformed hands, extra fingers, duplicate person, distorted face, text, watermark, logo";

export default function PromptBuilder({ selectedItem, onClearSelection }: Props) {
  const [form, setForm] = useState<Record<string, string>>(
    () => Object.fromEntries(fields.map(([key, , value]) => [key, value]))
  );
  const [canonicalPrompt, setCanonicalPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState(defaultNegative);
  const [model, setModel] = useState<PromptModel>("generic");
  const [aspectRatio, setAspectRatio] = useState("4:5");
  const [copied, setCopied] = useState<"prompt" | "negative" | null>(null);

  useEffect(() => {
    if (selectedItem) {
      setCanonicalPrompt(selectedItem.prompt);
      setNegativePrompt(selectedItem.negative_prompt);
      setAspectRatio(selectedItem.recommended.aspect_ratio);
    }
  }, [selectedItem]);

  const generatedCanonical = useMemo(() => {
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

  const basePrompt = canonicalPrompt || generatedCanonical;
  const adapted = useMemo(
    () => adaptPrompt(model, basePrompt, negativePrompt, aspectRatio),
    [model, basePrompt, negativePrompt, aspectRatio]
  );

  const generate = () => setCanonicalPrompt(generatedCanonical);

  const copy = async (kind: "prompt" | "negative", value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <section className="studio-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PROMPT BUILDER</span>
          <h2>One concept, multiple model-ready prompts.</h2>
        </div>
        <p>Compose once, then adapt the canonical MuseForge prompt for your target image model.</p>
      </div>

      {selectedItem && (
        <div className="selected-banner">
          <span>Starting from <strong>{selectedItem.title}</strong></span>
          <button onClick={onClearSelection}>Clear reference</button>
        </div>
      )}

      <div className="model-tabs" aria-label="Prompt model">
        {PROMPT_MODELS.map((entry) => (
          <button
            key={entry.id}
            className={model === entry.id ? "active" : ""}
            onClick={() => setModel(entry.id)}
          >
            <strong>{entry.label}</strong>
            <small>{entry.description}</small>
          </button>
        ))}
      </div>

      <div className="studio-layout">
        <div className="form-panel">
          {fields.map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <input
                value={form[key]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            </label>
          ))}
          <label>
            <span>Aspect ratio</span>
            <select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)}>
              <option value="1:1">1:1 · Square</option>
              <option value="4:5">4:5 · Portrait</option>
              <option value="2:3">2:3 · Portrait</option>
              <option value="3:2">3:2 · Landscape</option>
              <option value="16:9">16:9 · Wide</option>
            </select>
          </label>
          <button className="primary-button" onClick={generate}>Generate Canonical Prompt</button>
        </div>

        <div className="output-panel">
          <div className="adapter-heading">
            <div>
              <span className="eyebrow">MODEL OUTPUT</span>
              <h3>{PROMPT_MODELS.find((entry) => entry.id === model)?.label}</h3>
            </div>
            <span className="adapter-badge">{aspectRatio}</span>
          </div>

          <div className="prompt-label">
            <span>Prompt</span>
            <button onClick={() => copy("prompt", adapted.prompt)}>
              {copied === "prompt" ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <textarea
            value={adapted.prompt}
            readOnly
            rows={12}
          />

          {adapted.negative_prompt && (
            <>
              <div className="prompt-label negative-label">
                <span>Negative Prompt</span>
                <button onClick={() => copy("negative", adapted.negative_prompt)}>
                  {copied === "negative" ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <textarea className="negative-output" value={adapted.negative_prompt} readOnly rows={4} />
            </>
          )}

          <div className="parameter-grid">
            {Object.entries(adapted.parameters).map(([key, value]) => (
              <div key={key}>
                <span>{key.replaceAll("_", " ")}</span>
                <strong>{String(value)}</strong>
              </div>
            ))}
          </div>

          <div className="studio-note">
            <strong>Adapter notes</strong>
            {adapted.notes.map((note) => <p key={note}>{note}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
