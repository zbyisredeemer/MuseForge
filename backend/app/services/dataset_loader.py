import json
from pathlib import Path


class DatasetLoader:
    """Load MuseForge beauty prompt datasets."""

    def __init__(self, dataset_path: str = "dataset"):
        self.dataset_path = Path(dataset_path)

    def load(self, filename: str):
        file_path = self.dataset_path / filename
        if not file_path.exists():
            return []
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)

    def load_all(self):
        return {
            "styles": self.load("beauty_styles.json"),
            "clothing": self.load("clothing.json"),
            "scenes": self.load("scenes.json"),
            "camera": self.load("camera.json")
        }
