import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables from .env
load_dotenv()

# Initialize Gemini client
# Make sure GEMINI_API_KEY exists in .env
client = genai.Client()

# Gemini model (confirmed working)
MODEL_ID = "gemini-3-flash-preview"

app = FastAPI(title="VibeCheck Task Analyzer")

# --------- Request & Response Schemas ---------

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    summary: str
    tone: str
    urgency: int

# --------- Routes ---------

@app.get("/")
def root():
    return {"message": "Gemini 3 Backend is Live 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    prompt = f"""
You are a productivity assistant.

Analyze the following text and return ONLY a valid JSON object with this exact structure:
{{
  "summary": "one sentence summary",
  "tone": "emotional tone",
  "urgency": number from 1 to 5
}}

Text:
{req.text}
"""

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_level=types.ThinkingLevel.MEDIUM
                ),
                response_mime_type="application/json"
            )
        )

        # Convert Gemini JSON string → Python dict
        analysis_dict = json.loads(response.text)

        # Validate shape with Pydantic
        analysis = AnalyzeResponse(**analysis_dict)

        return {
            "status": "success",
            "model": MODEL_ID,
            "analysis": analysis
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Gemini returned invalid JSON"
        )

    except Exception as e:
        print("Gemini API error:", e)
        raise HTTPException(status_code=500, detail=str(e))

# --------- Local run ---------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
