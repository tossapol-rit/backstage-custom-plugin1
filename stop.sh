#!/bin/bash

echo "Stopping Backstage..."

# Stop using PID file
if [ -f .backstage.pid ]; then
  PID=$(cat .backstage.pid)
  if ps -p $PID > /dev/null 2>&1; then
    echo "Stopping main process (PID: $PID)..."
    kill $PID 2>/dev/null || true
    
    # Wait for graceful shutdown
    for i in {1..10}; do
      if ! ps -p $PID > /dev/null 2>&1; then
        break
      fi
      sleep 1
    done
    
    # Force kill if still running
    if ps -p $PID > /dev/null 2>&1; then
      echo "Force killing process..."
      kill -9 $PID 2>/dev/null || true
    fi
  fi
  rm .backstage.pid
fi

# Kill any processes on ports 3000 and 7007
echo "Stopping processes on ports 3000 and 7007..."
lsof -ti :3000,:7007 | xargs kill -9 2>/dev/null || true

# Kill any remaining backstage-cli processes
pkill -f "backstage-cli" 2>/dev/null || true

echo "✓ Backstage stopped"
