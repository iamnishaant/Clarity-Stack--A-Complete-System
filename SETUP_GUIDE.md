# ClarityStack v1.0 — Deployment & Architecture Guide

ClarityStack is a distributed intelligence architecture comprising 8 microservices. This guide ensures a stable, hardened deployment.

## 🚀 Stability Hardening (New in v1.0)
We have implemented several "Bulletproof" features to ensure system reliability:
- **Global Error Trap:** A top-level window listener captures boot-time crashes and displays actionable stack traces.
- **Render Guards:** All dashboard components are wrapped in defensive `try-catch` blocks to prevent malformed data from blanking the screen.
- **API Resilience:** `localStorage` interactions are safely wrapped to handle restricted browser environments (Brave/Private modes).
- **Sequential Port Mapping:** All services have been standardized to a predictable port range (8000-8007) to eliminate cross-service communication failures.

---

## 1. Port Architecture Standard
| Service | Port | Directory | Protocol |
|---------|------|-----------|----------|
| **Core Backend** | `8000` | `/Backend` | FastAPI / WebSocket |
| **SRS Intelligence** | `8001` | `/SRS_Service` | FastAPI / Transformers |
| **ThreatLens AI** | `8002` | `/ThreatLens_Service` | FastAPI / ML |
| **Knowledge Satellite** | `8003` | `/Satellite` | Node.js / MongoDB |
| **Collaborative Editor** | `8004` | `/Editor_Service` | Node.js / Socket.io |
| **UML Generation API** | `8005` | `/UML_Clarity_Service/backend` | FastAPI / GraphViz |
| **Main Dashboard (UI)** | `8006` | `/Web/Frontend` | Vite / React |
| **UML Visualizer (UI)** | `8007` | `/UML_Clarity_Service` | Vite / React |

---

## 2. One-Click Orchestration
To simplify local deployment, use the provided batch scripts:
- **`start_project.bat`**: Launches all 8 services in a multi-tab Windows Terminal window.
- **`kill_services.bat`**: Gracefully terminates all background processes on the 8000-8007 range.

---

## 3. Manual Installation
### Python Services (8000, 8001, 8002, 8005)
Each Python service requires a local virtual environment (`venv`).
1. Navigate to the service directory.
2. Run `python -m venv venv`.
3. Activate: `venv\Scripts\activate`.
4. Install: `pip install -r requirements.txt`.

### Node.js Services (8003, 8004, 8006, 8007)
1. Navigate to the service directory.
2. Run `npm install`.

---

## 4. Environment Configuration
Ensure `.env` files are present in all service roots.
- **Satellite:** Requires `MONGO_URI` and `GROQ_API_KEY`.
- **Frontend:** Requires `VITE_SATELLITE_URL` (default: `http://localhost:8003`).

---

## 5. Troubleshooting the "Blank Screen"
If you encounter a blank dashboard:
1. **Check the Red Box:** A red error overlay will appear if a boot crash occurs.
2. **Satellite Check:** Ensure MongoDB is connected; the Satellite logs `✅ MongoDB Atlas connected` on boot.
3. **Port Check:** Use `kill_services.bat` and restart to clear any zombie processes.
