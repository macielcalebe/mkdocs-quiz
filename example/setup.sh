#!/bin/bash

# MkDocs Quiz Plugin Example Setup Script
# This script sets up and runs the example documentation site

set -e  # Exit on any error

echo "🚀 Setting up MkDocs Quiz Plugin Example..."
echo "================================================"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if pip is available
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "❌ pip is required but not installed."
    exit 1
fi

# Use pip3 if available, otherwise pip
PIP_CMD="pip"
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
fi

echo "📦 Installing Python dependencies..."
$PIP_CMD install -r requirements.txt

echo "🔧 Installing MkDocs Quiz Plugin..."
$PIP_CMD install -e ..

echo "✅ Setup complete!"
echo ""
echo "🌐 Starting development server..."
echo "   The site will be available at: http://127.0.0.1:8000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the MkDocs development server
mkdocs serve
