import asyncio
import json
import random
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

# Logical Path for the suspect
TRACKING_SCENARIO = [
    {"cam": "CAM-0012", "loc": "CP Metro Exit Gate 2", "type": "FACE+CLOTHING"},
    {"cam": "CAM-6391", "loc": "Minto Road Flyover", "type": "CLOTHING"},
    {"cam": "CAM-1930", "loc": "Pahar Ganj Intersection", "type": "GAIT"},
    {"cam": "CAM-5245", "loc": "Janpath Market Gate 1", "type": "GAIT"},
    {"cam": "CAM-6481", "loc": "Janpath Market Gate 1", "type": "FACE+RE-ID"},
    {"cam": "CAM-2010", "loc": "New Delhi Station Entry", "type": "GAIT"},
]

@router.websocket("/ws/live-tracking")
async def live_tracking_ws(websocket: WebSocket):
    await websocket.accept()
    print("Demo Connection Established")
    
    try:
        index = 0
        while True:
            # Cycle through scenario points
            point = TRACKING_SCENARIO[index % len(TRACKING_SCENARIO)]
            
            payload = {
                "camera": point["cam"],
                "location": point["loc"],
                "time": datetime.now().strftime("%H:%M:%S"),
                "confidence": round(random.uniform(92.0, 99.0), 1),
                "status": "CONFIRMED",
                "method": point["type"]
            }
            
            await websocket.send_text(json.dumps(payload))
            
            # Increment and wait
            index += 1
            await asyncio.sleep(4) 
            
    except WebSocketDisconnect:
        print("Demo Client disconnected")