from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import incidents, alerts
from app.ws.live_tracking import router as live_ws

app = FastAPI(title="NETRA-AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(live_ws)

@app.get("/")
def health():
    return {"status": "NETRA-AI backend running"}
