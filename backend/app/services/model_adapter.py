"""Model-specific prompt adapters for MuseForge.

The adapters intentionally avoid pinning provider model versions. They transform one
canonical MuseForge prompt into portable output shapes for common image-generation
workflows.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Callable


SUPPORTED_MODELS = ("generic", "midjourney", "flux", "stable-diffusion")


@dataclass(frozen=True)
class AdaptedPrompt:
    model: str
    prompt: str
    negative_prompt: str
    parameters: dict
    notes: list[str]

    def to_dict(self) -> dict:
        return asdict(self)


def _aspect_ratio(value: str | None) -> str:
    value = (value or "4:5").strip()
    return value if ":" in value else "4:5"


def _clean(value: str | None) -> str:
    return " ".join((value or "").strip().split())


def adapt_generic(prompt: str, negative_prompt: str, aspect_ratio: str = "4:5") -> AdaptedPrompt:
    return AdaptedPrompt(
        model="generic",
        prompt=_clean(prompt),
        negative_prompt=_clean(negative_prompt),
        parameters={"aspect_ratio": _aspect_ratio(aspect_ratio)},
        notes=["Portable baseline prompt with separate negative prompt."],
    )


def adapt_midjourney(prompt: str, negative_prompt: str, aspect_ratio: str = "4:5") -> AdaptedPrompt:
    negative_terms = [
        term.strip()
        for term in _clean(negative_prompt).split(",")
        if term.strip() and term.strip().lower() not in {"child", "minor", "underage"}
    ]
    suffix = f"--ar {_aspect_ratio(aspect_ratio)} --stylize 150"
    if negative_terms:
        suffix += " --no " + ", ".join(negative_terms[:10])
    return AdaptedPrompt(
        model="midjourney",
        prompt=f"{_clean(prompt)} {suffix}".strip(),
        negative_prompt="",
        parameters={"aspect_ratio": _aspect_ratio(aspect_ratio), "stylize": 150},
        notes=[
            "Uses portable Midjourney-style parameters without pinning a model version.",
            "Negative terms are mapped to --no where practical.",
        ],
    )


def adapt_flux(prompt: str, negative_prompt: str, aspect_ratio: str = "4:5") -> AdaptedPrompt:
    natural_prompt = _clean(prompt)
    avoid = _clean(negative_prompt)
    if avoid:
        natural_prompt = (
            f"{natural_prompt}. Keep the result clean and coherent; avoid common rendering "
            f"artifacts such as {avoid}."
        )
    return AdaptedPrompt(
        model="flux",
        prompt=natural_prompt,
        negative_prompt="",
        parameters={"aspect_ratio": _aspect_ratio(aspect_ratio), "guidance_hint": "natural-language"},
        notes=[
            "FLUX-style output favors descriptive natural language.",
            "Negative guidance is folded into the positive instruction for portability across FLUX hosts.",
        ],
    )


def adapt_stable_diffusion(
    prompt: str,
    negative_prompt: str,
    aspect_ratio: str = "4:5",
) -> AdaptedPrompt:
    quality = "masterpiece, best quality, detailed portrait, natural skin texture"
    return AdaptedPrompt(
        model="stable-diffusion",
        prompt=f"{quality}, {_clean(prompt)}",
        negative_prompt=_clean(negative_prompt),
        parameters={
            "aspect_ratio": _aspect_ratio(aspect_ratio),
            "steps_hint": 28,
            "cfg_scale_hint": 6.5,
        },
        notes=[
            "Keeps positive and negative prompts separate.",
            "Steps and CFG values are hints only because checkpoints and UIs vary.",
        ],
    )


_ADAPTERS: dict[str, Callable[[str, str, str], AdaptedPrompt]] = {
    "generic": adapt_generic,
    "midjourney": adapt_midjourney,
    "flux": adapt_flux,
    "stable-diffusion": adapt_stable_diffusion,
}


def adapt_prompt(
    model: str,
    prompt: str,
    negative_prompt: str = "",
    aspect_ratio: str = "4:5",
) -> AdaptedPrompt:
    model_id = (model or "generic").strip().lower()
    adapter = _ADAPTERS.get(model_id)
    if adapter is None:
        raise ValueError(
            f"Unsupported model '{model}'. Supported models: {', '.join(SUPPORTED_MODELS)}"
        )
    return adapter(prompt, negative_prompt, aspect_ratio)


def adapt_all(prompt: str, negative_prompt: str = "", aspect_ratio: str = "4:5") -> dict[str, dict]:
    return {
        model: adapt_prompt(model, prompt, negative_prompt, aspect_ratio).to_dict()
        for model in SUPPORTED_MODELS
    }
