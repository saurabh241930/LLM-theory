#!/bin/bash

# Script to serve the LLM Theory documentation locally
# Requires Python 3

PORT=8000
DIRECTORY="/home/sp241930/Documents/LLM-theory/llm-docs-html"

echo "Starting local documentation server..."
echo "Access your docs at: http://localhost:$PORT"
echo "Press Ctrl+C to stop."

# Change to the documentation directory and start the server
cd "$DIRECTORY" || exit
python3 -m http.server $PORT
