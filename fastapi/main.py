# main.py
# To run this application:
# 1. Install dependencies:
#    pip install "fastapi[all]" uvicorn spacy spacy-transformers
# 2. Download the spaCy model:
#    python -m spacy download en_core_web_trf
# 3. Run the server:
#    uvicorn main:app --reload

import spacy
import asyncio
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, AsyncGenerator, Optional

# --- spaCy Model Loading and Application Lifespan ---

NLP_MODEL = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events.
    Loads the NLP model on startup.
    """
    global NLP_MODEL
    print("Loading spaCy model...")
    try:
        # 'en_core_web_trf' is a powerful transformer-based model.
        # For a lighter but still capable alternative, use 'en_core_web_lg'.
        NLP_MODEL = spacy.load("en_core_web_trf")
        print("spaCy model 'en_core_web_trf' loaded successfully.")
    except OSError:
        print("Error: spaCy model 'en_core_web_trf' not found.")
        print("Please run: python -m spacy download en_core_web_trf")
        NLP_MODEL = None
    
    yield
    
    # Clean up resources on shutdown if needed
    print("Cleaning up resources...")
    NLP_MODEL = None


# --- Application Setup ---

app = FastAPI(
    title="Advanced NLP Analysis API",
    description="A robust API for deep linguistic analysis of English text, featuring streaming.",
    version="2.1.0",
    lifespan=lifespan,
)

# Allow CORS for frontend development (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Models for Data Validation ---

class TextInput(BaseModel):
    text: str

class TokenAnalysis(BaseModel):
    text: str
    start: int
    end: int
    pos: str
    tag: str
    dep: str
    head: str
    shape: str
    is_alpha: bool
    is_stop: bool
    is_punct: bool
    is_entity: bool
    entity_type: Optional[str] = None
    morphology: Dict[str, str]
    lemma: str

class SentenceDetail(BaseModel):
    text: str
    start: int
    end: int

class EntityDetail(BaseModel):
    text: str
    start: int
    end: int
    label: str

class AnalysisResponse(BaseModel):
    tokens: List[TokenAnalysis]
    entities: List[EntityDetail]
    sentences: List[SentenceDetail]

# --- Helper Function for Analysis ---

def analyze_token(token: spacy.tokens.Token) -> Dict[str, Any]:
    """
    Performs a comprehensive analysis of a single spaCy token.

    Args:
        token: A spaCy token object.

    Returns:
        A dictionary containing detailed linguistic features.
    """
    return {
        "text": token.text,
        "start": token.idx,
        "end": token.idx + len(token),
        "pos": token.pos_,
        "tag": token.tag_,
        "dep": token.dep_,
        "head": token.head.text,
        "shape": token.shape_,
        "is_alpha": token.is_alpha,
        "is_stop": token.is_stop,
        "is_punct": token.is_punct,
        "is_entity": token.ent_type_ != "",
        "entity_type": token.ent_type_ or None,
        "morphology": token.morph.to_dict(),
        "lemma": token.lemma_,
    }

# --- API Endpoints ---

@app.get("/", summary="API Root", description="A simple hello world endpoint to check if the API is running.")
def read_root():
    return {"message": "NLP Analysis API is running. Use the /analyze or /analyze-stream endpoints."}

@app.post("/analyze", response_model=AnalysisResponse, summary="Highlight Syntax (Blocking)")
def analyze_text_blocking(input_data: TextInput) -> Dict[str, Any]:
    """
    Analyzes the entire text and returns all results in a single response.
    Best for short texts. For longer documents, use /analyze-stream.
    """
    if not NLP_MODEL:
        raise HTTPException(status_code=503, detail="NLP model is not available.")
    
    if not input_data.text or not input_data.text.strip():
        raise HTTPException(status_code=422, detail="Input text cannot be empty.")

    try:
        # Use nlp.pipe for consistency and efficiency, even for a single doc
        doc = next(NLP_MODEL.pipe([input_data.text]))
        
        token_results = [analyze_token(token) for token in doc]
        
        entity_results = [
            {"text": ent.text, "start": ent.start_char, "end": ent.end_char, "label": ent.label_}
            for ent in doc.ents
        ]

        sentence_results = [
            {"text": sent.text, "start": sent.start_char, "end": sent.end_char}
            for sent in doc.sents
        ]

        return {
            "tokens": token_results,
            "entities": entity_results,
            "sentences": sentence_results,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during text analysis: {e}")

async def stream_analyzer(text: str) -> AsyncGenerator[str, None]:
    """
    An asynchronous generator that processes text and yields analysis results
    as newline-delimited JSON (ndjson).
    """
    if not NLP_MODEL:
        error_message = json.dumps({"error": "NLP model is not available."})
        yield error_message + "\n"
        return

    try:
        # Use nlp.pipe for efficient streaming of a single long document
        doc = next(NLP_MODEL.pipe([text]))
        
        # Stream token-level analysis
        for token in doc:
            token_analysis = analyze_token(token)
            yield json.dumps({"type": "token", "data": token_analysis}) + "\n"
            await asyncio.sleep(0.001)

        # Stream entity-level analysis
        for ent in doc.ents:
            entity_data = {"text": ent.text, "start": ent.start_char, "end": ent.end_char, "label": ent.label_}
            yield json.dumps({"type": "entity", "data": entity_data}) + "\n"
            await asyncio.sleep(0.001)

    except Exception as e:
        error_message = json.dumps({"error": f"An error occurred during text analysis: {e}"})
        yield error_message + "\n"


@app.post("/analyze-stream", summary="Highlight Syntax (Streaming)")
async def analyze_text_streaming(input_data: TextInput):
    """
    Analyzes text and streams the results back as they are processed.
    This is ideal for long documents and interactive applications.
    The response is in newline-delimited JSON (ndjson) format.
    """
    if not input_data.text or not input_data.text.strip():
        raise HTTPException(status_code=422, detail="Input text cannot be empty.")

    return StreamingResponse(
        stream_analyzer(input_data.text),
        media_type="application/x-ndjson"
    )
