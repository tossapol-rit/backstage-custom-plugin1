#!/bin/bash

echo "🗑️  Cleaning Backstage Database..."
echo ""

# Stop Backstage first
echo "Stopping Backstage..."
./stop.sh 2>/dev/null

echo ""
echo "Stopping PostgreSQL..."
docker-compose -f docker-compose.postgres.yml down

echo ""
echo "Cleaning database..."

# Remove PostgreSQL volume
if docker volume ls | grep -q "backstage-custom-plugin1_postgres-data"; then
  docker volume rm backstage-custom-plugin1_postgres-data
  echo "✓ Removed PostgreSQL data volume"
else
  echo "✓ PostgreSQL volume not found (nothing to clean)"
fi

# Remove all database files in data directory (legacy)
if [ -d "data" ]; then
  rm -rf data/*
  echo "✓ Removed all files from data/ directory"
fi

# Remove backstage.db if exists (legacy)
if [ -f "backstage.db" ]; then
  rm -f backstage.db backstage.db-journal backstage.db-shm backstage.db-wal
  echo "✓ Removed legacy database files"
fi

echo ""
echo "✅ Database cleaned successfully!"
echo ""
echo "To start with fresh database:"
echo "  1. ./postgres-start.sh"
echo "  2. ./start.sh"
