import os
# --- NEW IMPORT HERE ---
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Setup: Load your secret key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

# ---NEW CODE BLOCK HERE---
# This tells the backend: "Trust requests coming from localhost:5173" (where our React app will run)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------

# 2. Define the input format
class InventoryQuery(BaseModel):
    query: str

# 3. The Agentic Logic (Sourcing, Compliance, Liaison)
@app.post("/process-request")
async def process_request(data: InventoryQuery):
    try:
        # Agent 1: Sourcing
        sourcing_prompt = f"You are a Hospital Sourcing Specialist. Analyze this request for supply chain logistics and pricing: {data.query}"
        sourcing_res = model.generate_content(sourcing_prompt)

        # Agent 2: Compliance
        compliance_prompt = f"You are a Healthcare Compliance Officer. Analyze this request for HIPAA, safety, and hospital policy risks: {data.query}"
        compliance_res = model.generate_content(compliance_prompt)

        # Agent 3: Liaison
        liaison_prompt = f"You are a Hospital Liaison. Draft a professional update for the surgical department regarding this request: {data.query}"
        liaison_res = model.generate_content(liaison_prompt)

        return {
            "sourcing_report": sourcing_res.text,
            "compliance_check": compliance_res.text,
            "doctor_memo": liaison_res.text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))