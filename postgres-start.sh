#!/bin/bash

echo "🚀 Starting PostgreSQL for Backstage..."
echo ""

# Start PostgreSQL
docker-compose -f docker-compose.postgres.yml up -d

echo ""
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is ready
for i in {1..30}; do
  if docker exec backstage-postgres pg_isready -U backstage > /dev/null 2>&1; then
    echo "✓ PostgreSQL is ready!"
    echo ""
    echo "PostgreSQL Connection Info:"
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo "  Database: backstage"
    echo "  User: backstage"
    echo "  Password: backstage"
    echo ""
    echo "To stop: docker-compose -f docker-compose.postgres.yml down"
    echo "To view logs: docker logs -f backstage-postgres"
    exit 0
  fi
  sleep 1
done

echo "❌ PostgreSQL failed to start"
exit 1
