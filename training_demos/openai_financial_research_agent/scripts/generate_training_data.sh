#!/bin/bash

# Script to run the financial research agent
# Usage:
#   ./scripts/run.sh                                    # Run all queries from data/questions.txt
#   ./scripts/run.sh "Your query here"                  # Run a single query

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root directory
cd "$PROJECT_ROOT"

# Run the main.py script with uv
# If an argument is provided, pass it to main.py
if [ $# -gt 0 ]; then
    uv run python main.py "$@"
else
    uv run python main.py
fi

