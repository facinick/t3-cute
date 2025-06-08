#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies using pip
pip install fastapi==0.109.2 uvicorn==0.27.1 spacy==3.7.4 python-multipart==0.0.9

# Download spaCy model if not already installed
python -m spacy download en_core_web_trf

# Start the server
uvicorn main:app --reload --port 8000 