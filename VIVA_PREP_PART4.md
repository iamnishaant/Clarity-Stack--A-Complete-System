# ClarityStack Viva Prep — PART 4: Execution Flows + Features + Master Q&A

## 11. COMPLETE EXECUTION FLOWS
### 11.1 User Sends a Chat Message (Core AI Pipeline)
1. **Frontend**: React captures input, fires `useMutation` (Axios) to `POST http://localhost:8000/chats/{id}/ask`.
2. **Backend (8000)**: `classify_signal` scores the text. If noise, auto-reply and exit.
3. **Extraction**: Calls 3 providers (Groq Llama 3.3, NVIDIA Llama 3.1, Groq Mixtral) in parallel.
   - Every provider is a live production endpoint; all mocks have been removed.
   - Responses are tagged: GROQ::, NVIDIA::, MIXTRAL::
4. **Synthesis**: Groq Llama 3.3-70B merges extracted blocks into a canonical IR.
5. **Storage**: Saves to SQLite; `knowledge_graph_builder` generates graph nodes/edges.
6. **Card Trigger**: Satellite (8003) is pinged to generate new Temporal Card versions.

### 11.2 Generating a Temporal Card (Satellite Flow)
1. **Frontend**: Request hits `POST http://localhost:8003/api/satellite/cards/:projectId/generate`.
2. **Satellite (8003)**: Fetches synthesis from Backend (8000).
3. **Decomposition**: `cardDecomposer` breaks IR into typed fragments.
4. **Synthesis**: `cardWriter` uses Groq to create a polished Knowledge Card.
5. **Versioning**: Chainer marks old versions as `superseded` and creates a new `active` card in MongoDB.

---

## 12. ARCHITECTURE DIAGRAM (Finalized)
```
         │ :8000 (Backend)   │ :8003 (Satellite)   │ :8004 (Editor)
         ▼                   ▼                     ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────────┐
│ FastAPI Core   │  │ Express Node   │  │ Socket.io Server   │
│ SQLite         │  │ MongoDB Atlas  │  │ Supabase (Postgres)│
└────────┬───────┘  └────────┬───────┘  └────────────────────┘
         │                   │                     :8001
         │ LLM Calls         │ LLM Calls    ┌────────────────┐
         ▼                   ▼              │ SRS Service    │
    ┌──────────┐        ┌──────────┐        │ FastAPI/Python │
    │ Groq/NIM │        │ Groq/NIM │        │ PyMuPDF + ML   │
    └──────────┘        └──────────┘        └────────────────┘
```

---

## 13. MASTER VIVA Q&A
**Q: The Gemini model was previously mocked. What is the current status?**
A: All mocks have been removed. The `ask_gemini` endpoint now redirects to **Groq Mixtral 8x7B**, providing a true 3-model live consensus (Groq Llama 3.3, NVIDIA Llama 3.1, and Groq Mixtral). This ensures high-quality IR blocks from three different high-parameter providers.

**Q: Why the 8000-8007 port mapping?**
A: To ensure a standardized, collision-free environment. It makes the system turnkey and predictable during deployment.

**Q: What is the "System Hardening" you implemented?**
A: We added top-level error boundaries in the Frontend to catch boot crashes, `try/catch` guards in the dashboard to prevent UI collapse on malformed data, and safe `localStorage` wrappers for privacy-mode browsers.

**Q: How does the Knowledge Graph avoid duplicates?**
A: Currently, it stores all extractions. A future improvement would be a semantic deduplication layer using vector embeddings to merge near-identical nodes.

---

## 14. QUICK-FIRE REFERENCE
| Topic | Value |
|---|---|
| Backend Port | 8000 |
| SRS Port | 8001 |
| ThreatLens Port | 8002 |
| Satellite Port | 8003 |
| Editor Port | 8004 |
| UML API Port | 8005 |
| Frontend Port | 8006 |
| UML UI Port | 8007 |
| Extraction Models | Groq Llama 3.3, NVIDIA Llama 3.1, Mixtral |
| Synthesis Model | Groq Llama 3.3-70B |
| Primary Database | SQLite + MongoDB Atlas |
| Real-time Protocol | Socket.io (WebSocket) |
