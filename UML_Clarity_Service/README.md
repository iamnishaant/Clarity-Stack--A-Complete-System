# UML-Clarity: AI-Assisted Diagram Generation from Software Requirements

UML-Clarity is an AI-assisted requirements engineering platform that transforms Software Requirements Specifications (SRS) and software documentation into structured, interactive software design diagrams.

Instead of directly mapping raw requirement sentences into diagram shapes, UML-Clarity uses a semantic abstraction pipeline to identify user goals, system components, workflows, and relationships before generating diagrams. The platform currently supports Use Case Diagrams, Activity Diagrams, and Data Flow Diagrams (DFDs) through an interactive visual workspace.

## 🚀 Key Features

* **Semantic Requirement Understanding**

  * Extracts meaningful software concepts from natural-language requirements instead of relying on keyword-based mapping.
  * Separates actors, processes, data stores, workflows, and system behaviors into structured semantic categories.

* **AI-Assisted Diagram Generation**

  * Generates:

    * **Use Case Diagrams**
    * **Activity Diagrams**
    * **Data Flow Diagrams (DFDs)**
  * Supports UML relationships such as `<<include>>` and `<<extend>>`.

* **Interactive Diagram Workspace**

  * Editable JointJS-based canvas with:

    * drag-and-drop interaction
    * movable connectors
    * auto-alignment
    * zoom/grid controls
    * dark/light themes

* **Human-in-the-Loop Refinement**

  * Users can modify classifications, reposition relationships, and refine generated diagrams after synthesis.

* **Semantic Traceability**

  * Generated nodes maintain traceability to their originating requirements for easier validation and debugging.

* **Performance Optimization**

  * Local semantic caching improves responsiveness and avoids repeated recomputation.

---

# 🧠 System Architecture

UML-Clarity is divided into two major layers:

## 1. Semantic Intelligence Engine (`backend/pipeline/uml_semantic_engine.py`)

Responsible for:

* parsing SRS/README documents
* extracting structured entities
* generating semantic relationships
* producing standardized diagram-ready JSON

The pipeline performs:

1. Requirement Classification
2. Goal Abstraction
3. Relationship Synthesis

The backend uses NVIDIA NIM (`meta/llama-3.1-8b-instruct`) for semantic reasoning and structured extraction.

---

## 2. Diagram Rendering Engine (`src/components/DiagramCanvas.jsx`)

Responsible for:

* rendering diagram entities on JointJS canvas
* enforcing UML/DFD notation styles
* managing interaction state
* supporting dynamic editing and layout adjustments

Custom shapes and notation rules are defined in:

```text
src/joint-logic/customShapes.js
```

---

# 📊 Supported Diagram Types

## Use Case Diagrams

Supports:

* Actors
* Use Cases
* System Boundaries
* `<<include>>`
* `<<extend>>`

## Activity Diagrams

Supports:

* Start Nodes
* End States
* Action States
* Decision Nodes

## Data Flow Diagrams (DFDs)

Supports:

* External Entities
* Processes
* Data Stores
* Data Flows

---

# 🛠️ Tech Stack

### Frontend

* React
* Vite
* JointJS
* Lucide React

### Backend

* Python
* FastAPI

### AI Layer

* NVIDIA NIM
* `meta/llama-3.1-8b-instruct`

---

# ⚙️ Local Setup & Installation

## Prerequisites

* Node.js (v18+)
* Python 3.10+
* NVIDIA API Key

---

## 1. Backend Setup

```bash
cd backend

python -m venv uml_venv

# Activate environment
# Windows:
.\uml_venv\Scripts\activate

# Mac/Linux:
source uml_venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
NVIDIA_API_KEY=your_api_key_here
```

Run the FastAPI server:

```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

---

## 2. Frontend Setup

```bash
npm install
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

# 📁 Project Structure

```text
UML-Clarity/
├── backend/
│   ├── api.py
│   ├── pipeline/
│   │   └── uml_semantic_engine.py
│   └── data/
│       └── raw_SRS_processed/
│
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── DiagramCanvas.jsx
│   │   └── NodePanel.jsx
│   │
│   └── joint-logic/
│       └── customShapes.js
│
└── package.json
```

---

# 🎯 Project Goal

UML-Clarity aims to simplify early-stage software modeling by combining semantic AI extraction with interactive diagram editing.

The platform focuses on generating meaningful first-draft software diagrams while allowing users to iteratively refine and validate the generated architecture visually.
