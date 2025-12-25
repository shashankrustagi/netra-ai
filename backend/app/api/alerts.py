from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/alerts")
async def get_active_alerts():
    # This matches the Alert type in your React code
    return [
        {
            "id": 1,
            "type": "FACE MATCH",
            "priority": "HIGH",
            "loc": "Karol Bagh Metro",
            "cam": "CAM-0443",
            "conf": "91.6%",
            "time": datetime.now().strftime("%H:%M:%S")
        },
        {
            "id": 2,
            "type": "VEHICLE ANPR",
            "priority": "MEDIUM",
            "loc": "CP Metro Exit",
            "cam": "CAM-7417",
            "conf": "87.1%",
            "time": datetime.now().strftime("%H:%M:%S")
        }
    ]