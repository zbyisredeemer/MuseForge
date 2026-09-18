"""
MuseForge Prompt Generator Core
"""

from app.models.prompt_schema import BeautyPromptRequest, GeneratedPrompt


class PromptGenerator:

    def generate(self, request: BeautyPromptRequest) -> GeneratedPrompt:
        parts = [
            f"A beautiful {request.country} woman",
            request.beauty_style,
            request.clothing,
            request.hairstyle,
            request.makeup,
            request.scene,
            request.pose,
            request.camera,
            request.lighting,
            "ultra realistic",
            "cinematic photography",
            "high detail"
        ]

        prompt = ", ".join(
            item for item in parts if item
        )

        return GeneratedPrompt(
            prompt=prompt,
            negative_prompt="low quality, blurry, distorted face",
            tags=[request.country, request.beauty_style]
        )
