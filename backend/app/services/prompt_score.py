class PromptScore:
    """Simple prompt quality evaluation."""

    def calculate(self, prompt: str):
        score = 0

        keywords = [
            "beauty",
            "woman",
            "clothing",
            "scene",
            "cinematic",
            "lighting",
            "camera"
        ]

        for keyword in keywords:
            if keyword.lower() in prompt.lower():
                score += 10

        return {
            "total_score": min(score, 100),
            "details": {
                "completeness": score
            }
        }
