#!/bin/bash
# runApp.sh
# Starts AIFlashcards Node.js backend, Python AI service, and Angular frontend.
# Frees required ports if occupied.

set -e

# Resolve absolute paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/AIFlashcards_Backend"
AI_SERVICE_DIR="$BACKEND_DIR/ai_service"
FRONTEND_DIR="$SCRIPT_DIR/AIFlashcards_Frontend"

echo "🚀 Starting AIFlashcards application..."

# --- Function to free port cross-platform ---
free_port() {
    local PORT=$1
    if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32"* ]]; then
        # Windows
        PID=$(netstat -ano | findstr ":$PORT" | awk '{print $5}' | uniq || true)
        if [ -n "$PID" ]; then
            echo "⚠️ Port $PORT is occupied by PID $PID. Terminating..."
            taskkill //PID $PID //F
            echo "✅ Port $PORT freed."
        else
            echo "ℹ️ Port $PORT is free."
        fi
    else
        # Linux/macOS
        PID=$(lsof -ti tcp:$PORT 2>/dev/null || true)
        if [ -n "$PID" ]; then
            echo "⚠️ Port $PORT is occupied by PID $PID. Terminating..."
            kill -9 $PID
            echo "✅ Port $PORT freed."
        else
            echo "ℹ️ Port $PORT is free."
        fi
    fi
}

# --- Free required ports ---
free_port 5000  # Python AI service
free_port 3000  # Backend
free_port 4200  # Frontend

# --- Start Python AI Service ---
echo "🐍 Starting Python AI service..."
cd "$AI_SERVICE_DIR"
if [ ! -d "venv" ]; then
  echo "⚠️ Python virtual environment not found. Please run ./installApp.sh first."
  exit 1
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32"* ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

python app.py &
AI_PID=$!
echo "✅ Python AI service started with PID $AI_PID"

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
