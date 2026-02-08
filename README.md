# VibeCheck – Gemini 3 Task Analyzer

VibeCheck is a full-stack AI tool that analyzes text inputs to determine:
- A concise summary
- Emotional tone
- Urgency level (1–5)

Built using Gemini 3 for fast, structured analysis.

## Tech Stack
- Gemini 3 (google-generative-ai)
- FastAPI (Backend)
- React + Vite (Frontend)

## How It Works
1. User inputs a task or message
2. Frontend sends text to FastAPI backend
3. Backend uses Gemini 3 to generate structured JSON
4. Results are displayed in the UI

## Running Locally

### Backend
```bash
cd vibecheck-backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
Create a .env file:
GEMINI_API_KEY=your_api_key_here
```

### Frontend
```bash
cd frontend
npm install
npm run dev
Open http://localhost:5173
```

# Made by Srijoni Ghosh, Sunetra Pandey, Ayantika Jana
