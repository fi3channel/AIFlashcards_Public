#!/bin/bash
# runApp.sh
# This script starts the AIFlashcards Node.js backend, Python AI service, and Angular frontend.
# It first checks if required ports are occupied and terminates any process using them.

set -e

# Resolve absolute paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/AIFlashcards_Backend"
AI_SERVICE_DIR="$BACKEND_DIR/ai_service"
FRONTEND_DIR="$SCRIPT_DIR/AIFlashcards_Frontend"

echo "🚀 Starting AIFlashcards application..."

# --- Function to free port ---
free_port() {
    local PORT=$1
    PID=$(lsof -ti tcp:$PORT 2>/dev/null || true)
    if [ -n "$PID" ]; then
        echo "⚠️ Port $PORT is occupied by PID $PID. Terminating..."
        kill -9 $PID
        echo "✅ Port $PORT freed."
    else
        echo "ℹ️ Port $PORT is free."
    fi
}

# --- Free ports ---
free_port 3000  # Backend
free_port 4200  # Frontend

# --- Start Backend ---
echo "📦 Starting Node.js backend..."
cd "$BACKEND_DIR"
npm run start &
NODE_PID=$!
echo "✅ Node.js backend started with PID $NODE_PID"

# --- Start Frontend ---
echo "🌐 Starting Angular frontend..."
cd "$FRONTEND_DIR"
npm start &
FRONTEND_PID=$!
echo "✅ Angular frontend started with PID $FRONTEND_PID"

echo "🎉 All services started successfully!"

# Wait for all background processes
wait $AI_PID $NODE_PID $FRONTEND_PID
