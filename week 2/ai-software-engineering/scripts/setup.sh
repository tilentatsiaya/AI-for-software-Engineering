#!/bin/bash

echo "Ì¥ß Setting up Disease Outbreak Prediction System..."

# Create necessary directories
mkdir -p models data logs

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "‚ùå Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "‚ùå Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Install Python dependencies
echo "Ì≥¶ Installing Python dependencies..."
pip3 install -r requirements.txt

# Train the ML model
echo "Ì¥ñ Training ML model..."
python3 src/train_model.py

# Install Node.js dependencies
echo "Ì≥¶ Installing Node.js dependencies..."
npm install

echo "Ìæâ Setup completed successfully!"
echo ""
echo "Ì≥ã Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Use the web interface to make predictions"
