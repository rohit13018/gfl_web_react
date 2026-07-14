#!/bin/bash

echo "🚀 Starting backend (server.js on :4000)..."
npm run server &
SERVER_PID=$!

echo "🚀 Starting React UI (vite)..."
npm run dev &
UI_PID=$!

echo ""
echo "✅ Backend: http://localhost:4000"
echo "✅ React UI: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."

cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $SERVER_PID $UI_PID 2>/dev/null
    wait $SERVER_PID $UI_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

wait
