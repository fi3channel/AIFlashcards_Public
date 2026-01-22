#!/bin/bash
# installApp.sh
set -e  # Exit on error

# Resolve absolute paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/AIFlashcards_Backend"
AI_SERVICE_DIR="$BACKEND_DIR/ai_service"
FRONTEND_DIR="$SCRIPT_DIR/AIFlashcards_Frontend"

echo "🚀 Starting installation for AIFlashcards..."

# --- 1. Backend Node.js setup ---
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install

# --- 2. Python AI service setup ---
echo "🐍 Setting up Python AI service..."

# Check if python3-venv is installed (Specific to Ubuntu/Debian)
if ! dpkg -s python3-venv >/dev/null 2>&1; then
    echo "❌ Error: python3-venv is not installed on your system."
    echo "Please run: sudo apt update && sudo apt install python3-venv"
    exit 1
fi

cd "$AI_SERVICE_DIR"

# Remove venv if it exists but is broken (missing activation script)
if [ -d "venv" ] && [ ! -f "venv/bin/activate" ]; then
    echo "⚠️  Found broken virtual environment. Cleaning up..."
    rm -rf venv
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🛠 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate and install requirements
echo "📥 Installing Python requirements..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

# --- 3. Frontend setup ---
echo "📦 Installing and building frontend..."
cd "$FRONTEND_DIR"
npm install
npm run build:app

echo "------------------------------------------------"
echo "🎉 Setup complete!"
echo "You can now run the app using: ./startApp.sh"