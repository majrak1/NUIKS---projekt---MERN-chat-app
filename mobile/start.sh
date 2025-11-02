#!/bin/bash

# Script to start Expo with increased file limits (fixes EMFILE error on macOS)

# Check if watchman is installed
if command -v watchman &> /dev/null; then
    echo "Watchman found - starting Expo normally..."
    npx expo start
else
    echo "Watchman not found. Using increased file limit..."
    echo "For best results, install watchman: brew install watchman"
    echo ""
    ulimit -n 4096 2>/dev/null || echo "Could not increase file limit"
    npx expo start
fi
