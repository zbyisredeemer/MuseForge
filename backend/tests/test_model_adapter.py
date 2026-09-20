import unittest

from backend.app.services.model_adapter import SUPPORTED_MODELS, adapt_all, adapt_prompt


class ModelAdapterTest(unittest.TestCase):
    def setUp(self):
        self.prompt = "A fictional adult woman, elegant fashion, cinematic portrait"
        self.negative = "blurry, bad anatomy, watermark"

    def test_all_models_are_available(self):
        outputs = adapt_all(self.prompt, self.negative, "4:5")
        self.assertEqual(set(outputs), set(SUPPORTED_MODELS))

    def test_generic_keeps_negative_prompt(self):
        output = adapt_prompt("generic", self.prompt, self.negative, "4:5")
        self.assertEqual(output.negative_prompt, self.negative)
        self.assertEqual(output.parameters["aspect_ratio"], "4:5")

    def test_midjourney_maps_aspect_ratio(self):
        output = adapt_prompt("midjourney", self.prompt, self.negative, "2:3")
        self.assertIn("--ar 2:3", output.prompt)
        self.assertIn("--no", output.prompt)
        self.assertEqual(output.negative_prompt, "")

    def test_flux_uses_natural_language(self):
        output = adapt_prompt("flux", self.prompt, self.negative, "4:5")
        self.assertIn("avoid common rendering artifacts", output.prompt)
        self.assertEqual(output.negative_prompt, "")

    def test_stable_diffusion_keeps_separate_negative(self):
        output = adapt_prompt("stable-diffusion", self.prompt, self.negative, "4:5")
        self.assertIn("best quality", output.prompt)
        self.assertEqual(output.negative_prompt, self.negative)

    def test_unknown_model_fails(self):
        with self.assertRaises(ValueError):
            adapt_prompt("unknown", self.prompt)


if __name__ == "__main__":
    unittest.main()
