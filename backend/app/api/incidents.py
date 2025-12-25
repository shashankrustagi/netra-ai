from fastapi import APIRouter
import json

router = APIRouter()

@router.get("/incident/{incident_id}")
def get_incident(incident_id: str):
    with open("app/data/mock_incident.json") as f:
        data = json.load(f)
    return data
