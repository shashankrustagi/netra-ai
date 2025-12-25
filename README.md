# NETRA-AI: National Enhanced Tracking and Real-time Analytics
## Delhi Police Command and Control Center Prototype (Safe City Initiative)

NETRA-AI is a high-performance, AI-driven surveillance system designed for real-time suspect triangulation. This dashboard is tailored for the Delhi Police "Safe City" vision, providing a unified operational picture for tracking targets across city-wide camera grids.

## 🏛 Vision and Mission
**Shanti (Peace):** Preventing crime through AI-enabled behavioral analysis.

**Seva (Service):** Rapid response through integrated PCR unit dispatch.

**Nyaya (Justice):** Maintaining tamper-proof audit logs for investigative integrity.

## 🛠 Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS (Delhi Police Navy and Red Theme)
- **Backend:** FastAPI (Python), WebSockets for real-time data streaming
- **Logic:** SVG-based trajectory mapping and AI confidence scoring

## 📂 Project Structure
```
NETRA-AI
├── backend
│   ├── app
│   │   ├── api (alerts.py, incidents.py)
│   │   ├── data (mock_alerts.json, mock_tracking.json)
│   │   ├── models (alert.py, tracking.py)
│   │   └── ws (live_tracking.py)
│   └── main.py
├── frontend
│   ├── src
│   │   ├── components (UI Blocks)
│   │   ├── hooks (WebSocket Logic)
│   │   ├── pages (App.tsx Dashboard)
│   │   └── styles (Tailwind CSS)
│   └── package.json
└── README.md
```

## 🚀 Installation Guide
### 1. Backend Setup (FastAPI)
Navigate to the backend folder:
```
cd backend
```
Create a virtual environment:
```
python -m venv .venv
```
Activate the environment:
- **Mac/Linux:** `source .venv/bin/activate`
- **Windows:** `.venv\Scripts\activate`

Install requirements:
```
pip install -r requirements.txt
```
Run the server:
```
python main.py
```

### 2. Frontend Setup (React and Vite)
Open a new terminal and navigate to the frontend folder:
```
cd frontend
```
Install dependencies:
```
npm install
```
Start the development server:
```
npm run dev
```
Open your browser at: [http://localhost:5173](http://localhost:5173)

## 🛡 Security and Audit Features
- **Audit Logs:** Every action like a mission reset or alert acknowledgment is recorded with a timestamp
- **RBAC Logic:** Distinct permission levels for Admin, Officer, and Viewer roles
- **Gov-Ready:** Architecture optimized for deployment within secure, air-gapped government networks

## ⚖️ Legal Disclaimer
This software is a Technical Prototype. Delhi Police branding and logos are used for conceptual visualization only. No real surveillance data is processed or stored in this version.


