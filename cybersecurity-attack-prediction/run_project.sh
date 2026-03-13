#!/bin/bash

# Kill any existing processes on port 3000 and 8000
echo "Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Start Backend
echo "Starting Backend..."
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r backend/requirements.txt
python3 backend/main.py &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend..."
npm install
npm run dev &
FRONTEND_PID=$!

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Wait for processes
wait
