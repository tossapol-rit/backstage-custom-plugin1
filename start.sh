#!/bin/bash

# Start Backstage in background
echo "Starting Backstage..."

# Kill existing processes if any
./stop.sh 2>/dev/null || true

# Start Backstage in background and save PID
nohup yarn start > backstage.log 2>&1 &
echo $! > .backstage.pid

echo "Backstage is starting in background..."
echo "PID: $(cat .backstage.pid)"
echo "Logs: tail -f backstage.log"
echo ""
echo "Waiting for services to start..."

# Wait for backend to be ready (max 60 seconds)
for i in {1..60}; do
  if curl -s http://localhost:7007/api/catalog/entities > /dev/null 2>&1; then
    echo "✓ Backend is ready (port 7007)"
    break
  fi
  sleep 1
done

# Wait for frontend to be ready (max 60 seconds)
for i in {1..60}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Frontend is ready (port 3000)"
    break
  fi
  sleep 1
done

echo ""
echo "Backstage is running!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:7007"
echo ""
echo "To stop: ./stop.sh"
echo "To view logs: tail -f backstage.log"
