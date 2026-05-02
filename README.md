# MTSP Solver: Disaster Relief Logistics Optimizer

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Spaces-blue?style=for-the-badge)

👉 **Live Frontend Demo**: [https://priyam2324.github.io/mtsp-solver-frontend/](https://priyam2324.github.io/mtsp-solver-frontend/)  
👉 **Live Backend API**: [https://huggingface.co/spaces/Priyam2307/mtsp-solver-backend](https://huggingface.co/spaces/Priyam2307/mtsp-solver-backend)

This project is a visual, interactive implementation of a novel approach to optimizing complex multi-agent routing problems.

---

## 🌍 The Real-World Problem
In disaster relief management, the rapid and equitable distribution of critical resources (food, water, medical supplies, shelter) is the single most important determinant of operational success. Planning these distribution routes across multiple relief vehicles efficiently is incredibly complex. 

Mathematically, this is modeled as the **Multiple-Traveling Salesman Problem (MTSP)**, a known NP-hard problem. Because of the exponential number of routing combinations, calculating exact optimal routes quickly becomes computationally infeasible, requiring advanced metaheuristic algorithms to find near-optimal solutions in real-time.

## 🚀 Novel Solution: Modified DSGO
To tackle the MTSP effectively in the dynamic context of disaster relief, this project utilizes a novel **Modified Discrete Social Group Optimization (DSGO)** algorithm. 

Inspired by human social group behavior—where individuals learn from the best member while also exploring new strategies through peer interaction—this custom DSGO implementation provides an unparalleled balance between exploration (finding new routes) and exploitation (refining good routes). To accommodate the strict requirements of MTSP, the algorithm employs a unique circular queue representation and a custom discrete crossover operator that ensures route feasibility at every step.

**Why is this approach groundbreaking?**
Extensive testing against state-of-the-art metaheuristics (like Genetic Algorithms, Artificial Bee Colony, Discrete Particle Swarm Optimization, and TLBO) shows that this modified DSGO consistently achieves:
- **Superior Route Quality**: Lower travel distances and faster response times.
- **Faster Convergence**: Discovers optimal routes in fewer generations.
- **High Scalability & Stability**: Maintains low variability and resists premature convergence even as the problem scales (e.g., coordinating 10 relief vehicles across 50 disaster zones).

---

## 💻 Project Architecture

The system is split into a highly decoupled, modern web stack.

### 1. Frontend (React + Vite + Leaflet)
- **Role**: Provides an interactive geographical map where users can dynamically place "Cities" (affected disaster zones) and "Salesmen" (relief depots/vehicles). It visualizes the computed routes and graphs the algorithm's fitness convergence curve.
- **Hosting**: Hosted on **GitHub Pages**.

### 2. Backend (FastAPI + Python)
- **Role**: The algorithmic engine. A high-performance Python API that ingests coordinate data, executes the Modified DSGO algorithm over multiple generations, and returns the optimized paths and historical fitness metrics.
- **Hosting**: Packaged in a Docker container and deployed seamlessly to **Hugging Face Spaces**.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Ensure that `frontend/src/api.js` points to `http://127.0.0.1:8000` or configure your `.env` file accordingly).*
