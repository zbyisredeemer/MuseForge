"""
MuseForge Prompt Schema

Unified data structure for AI beauty prompt generation.
"""

from dataclasses import dataclass, field
from typing import List


@dataclass
class BeautyPromptRequest:
    country: str = ""
    beauty_style: str = ""
    clothing: str = ""
    hairstyle: str = ""
    makeup: str = ""
    scene: str = ""
    pose: str = ""
    camera: str = ""
    lighting: str = ""


@dataclass
class GeneratedPrompt:
    prompt: str
    negative_prompt: str = ""
    tags: List[str] = field(default_factory=list)
