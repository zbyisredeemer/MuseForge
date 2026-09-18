from fastapi import FastAPI
from app.api.v1.prompt import router as prompt_router
from app.api.v1.beauty import router as beauty_router

app = FastAPI(
    title="MuseForge API",
    description="AI Beauty Prompt Engineering Platform",
    version="1.0.0"
)

app.include_router(prompt_router, prefix="/api/v1")
app.include_router(beauty_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok", "service": "museforge"}
