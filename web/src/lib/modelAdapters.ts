import type { AdaptedPrompt, PromptModel } from "../types";

export const PROMPT_MODELS: { id: PromptModel; label: string; description: string }[] = [
  { id: "generic", label: "Generic", description: "Portable baseline" },
  { id: "midjourney", label: "Midjourney", description: "Parameters + --no" },
  { id: "flux", label: "FLUX", description: "Natural-language optimized" },
  { id: "stable-diffusion", label: "Stable Diffusion", description: "Positive + negative" },
];

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function ratio(value?: string) {
  return value?.includes(":") ? value : "4:5";
}

export function adaptPrompt(
  model: PromptModel,
  prompt: string,
  negativePrompt: string,
  aspectRatio = "4:5",
): AdaptedPrompt {
  const ar = ratio(aspectRatio);
  const positive = clean(prompt);
  const negative = clean(negativePrompt);

  if (model === "midjourney") {
    const negativeTerms = negative
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term && !["child", "minor", "underage"].includes(term.toLowerCase()))
      .slice(0, 10);
    return {
      model,
      prompt: `${positive} --ar ${ar} --stylize 150${negativeTerms.length ? ` --no ${negativeTerms.join(", ")}` : ""}`,
      negative_prompt: "",
      parameters: { aspect_ratio: ar, stylize: 150 },
      notes: ["Portable Midjourney-style parameters; no model version is pinned."],
    };
  }

  if (model === "flux") {
    return {
      model,
      prompt: negative
        ? `${positive}. Keep the result clean and coherent; avoid common rendering artifacts such as ${negative}.`
        : positive,
      negative_prompt: "",
      parameters: { aspect_ratio: ar, guidance_hint: "natural-language" },
      notes: ["Negative guidance is folded into the instruction for portability across FLUX hosts."],
    };
  }

  if (model === "stable-diffusion") {
    return {
      model,
      prompt: `masterpiece, best quality, detailed portrait, natural skin texture, ${positive}`,
      negative_prompt: negative,
      parameters: { aspect_ratio: ar, steps_hint: 28, cfg_scale_hint: 6.5 },
      notes: ["Steps and CFG values are starting hints; tune them for the chosen checkpoint."],
    };
  }

  return {
    model: "generic",
    prompt: positive,
    negative_prompt: negative,
    parameters: { aspect_ratio: ar },
    notes: ["Portable baseline prompt with a separate negative prompt."],
  };
}
