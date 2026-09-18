"""Beauty style API routes.

MuseForge v1 API skeleton.
"""

from typing import List


BEAUTY_STYLES = [
    {
        "name": "Eastern Classical Beauty",
        "tags": ["China", "Hanfu", "Elegant", "Traditional"],
    },
    {
        "name": "French Elegant Beauty",
        "tags": ["France", "Fashion", "Chic"],
    },
    {
        "name": "Japanese Kimono Beauty",
        "tags": ["Japan", "Kimono", "Traditional"],
    },
]


def list_beauty_styles() -> List[dict]:
    return BEAUTY_STYLES
