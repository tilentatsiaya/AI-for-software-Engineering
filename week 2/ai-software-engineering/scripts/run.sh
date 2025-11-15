#!/bin/bash

echo "Ì∫Ä Starting Disease Outbreak Prediction System..."

# Check if model exists
if [ ! -f "models/disease_predictor.joblib" ]; then
    echo "Ì¥ñ Model not found. Training model first..."
    python3 src/train_model.py
fi

# Start the development server
echo "Ìºê Starting web server..."
npm run dev
