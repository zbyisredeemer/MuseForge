"""
MuseForge beauty prompt recommendation engine.

Rule based recommendation MVP.
"""


def recommend(user_preferences: dict):
    recommendations = []

    if user_preferences.get("country") == "China":
        recommendations.append({
            "style": "Eastern Classical Beauty",
            "clothing": "Hanfu",
            "scene": "Jiangnan Garden"
        })

    if user_preferences.get("season") == "Autumn":
        recommendations.append({
            "lighting": "golden hour",
            "scene": "autumn forest"
        })

    return recommendations
