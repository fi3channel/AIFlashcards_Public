#!/bin/bash
# installApp.sh
# This script installs dependencies for both backend and frontend,
# then builds the AIFlashcards frontend.

set -e  # Exit immediately if a command fails

# Resolve absolute path of the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/AIFlashcards_Backend"
FRONTEND_DIR="$SCRIPT_DIR/AIFlashcards_Frontend"

echo "🚀 Starting full installation process..."

# --- Backend setup ---
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install
echo "✅ Backend dependencies installed successfully!"

# --- Frontend setup ---
echo "📦 Installing and building frontend..."
cd "$FRONTEND_DIR"
npm run build:app
echo "✅ Frontend built successfully!"

echo "🎉 All installations and builds completed successfully!"
