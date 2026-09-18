"""
MuseForge application entry point.

Future versions will expose FastAPI endpoints.
"""

from app.generator.prompt_generator import PromptGenerator
from app.models.prompt_schema import BeautyPromptRequest


if __name__ == "__main__":
    generator = PromptGenerator()

    result = generator.generate(
        BeautyPromptRequest(
            country="China",
            beauty_style="Eastern classical beauty",
            clothing="Hanfu",
            scene="Autumn Jiangnan garden",
            camera="85mm portrait lens",
            lighting="soft golden light"
        )
    )

    print(result.prompt)
