#!/bin/bash
# installApp.sh
# Installs dependencies for backend, Python AI service, and frontend,
# then builds the AIFlashcards frontend.

set -e  # Exit immediately if a command fails

# Resolve absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/AIFlashcards_Backend"
AI_SERVICE_DIR="$BACKEND_DIR/ai_service"
FRONTEND_DIR="$SCRIPT_DIR/AIFlashcards_Frontend"

echo "🚀 Starting full installation process..."

# --- Backend Node.js setup ---
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install
echo "✅ Backend dependencies installed successfully!"

# --- Python AI service setup ---
echo "🐍 Setting up Python AI service..."

# Check for python/python3
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python 3.10+ not found. Please install Python 3."
    exit 1
fi

cd "$AI_SERVICE_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    $PYTHON_CMD -m venv venv
fi

# Detect OS for activation
if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32"* ]]; then
    # Windows (Git Bash)
    source venv/Scripts/activate
else
    # Linux/macOS
    source venv/bin/activate
fi

# Upgrade pip inside the venv
python -m pip install --upgrade pip

# --- Install Python requirements ---
pip install -r requirements.txt

# --- Windows-specific PyTorch fix ---
if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32"* ]]; then
    echo "🛠 Checking for Microsoft Visual C++ Redistributable (required for PyTorch)..."

    # Try importing torch to check if DLLs work
    python -c "import torch" 2>/dev/null || {
        echo "⚠️ PyTorch DLLs missing. Installing Visual C++ Redistributable..."
        echo "Please download and install: https://aka.ms/vs/17/release/vc_redist.x64.exe"
        echo "After installation, re-run this script."
        exit 1
    }

    echo "✅ Visual C++ Redistributable seems installed. PyTorch DLLs OK."
fi

echo "✅ Python AI service ready!"

# --- Frontend setup ---
echo "📦 Installing and building frontend..."
cd "$FRONTEND_DIR"
npm run build:app
echo "✅ Frontend built successfully!"

echo "🎉 All installations and builds completed successfully!"
