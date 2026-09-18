"""Beauty concept recommendation service.

MVP implementation based on keyword matching.
"""


RECOMMENDATIONS = [
    {
        "keywords": ["东方", "中国", "古典", "秋天"],
        "style": "Eastern Classical Beauty",
        "clothing": "Hanfu",
        "scene": "Jiangnan Garden",
        "camera": "85mm cinematic"
    },
    {
        "keywords": ["法国", "时尚", "优雅"],
        "style": "French Elegant Beauty",
        "clothing": "Luxury Dress",
        "scene": "Paris Cafe",
        "camera": "50mm fashion photography"
    }
]


def recommend(keyword: str) -> dict:
    for item in RECOMMENDATIONS:
        if any(word in keyword for word in item["keywords"]):
            return item
    return RECOMMENDATIONS[0]
