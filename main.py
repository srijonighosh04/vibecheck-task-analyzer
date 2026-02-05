import os
import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# Initialize Gemini client
# Ensure GEMINI_API_KEY is in your .env file
client = genai.Client()

# Hackathon Model ID (use gemini-3-pro-preview for deeper reasoning)
MODEL_ID = "gemini-3-flash-preview"

app = FastAPI(title="VibeCheck Task Analyzer")

class AnalyzeRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "Gemini 3 Backend is Live 🚀"}

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    prompt = f"""
    You are a productivity assistant.
    Analyze the following text and return a valid JSON object with these keys:
    - summary: a one-sentence summary
    - tone: the emotional tone (happy, stressed, anxious, neutral, etc.)
    - urgency: an urgency score from 1 (low) to 5 (high)

    Text:
    {req.text}
    """

    try:
        # Gemini 3 specific: using thinking_level for better reasoning
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_level=types.ThinkingLevel.MEDIUM
                ),
                # Forces the model to return a clean JSON object
                response_mime_type="application/json"
            )
        )

        return {
            "status": "success",
            "model": MODEL_ID,
            "analysis": response.text
        }

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)