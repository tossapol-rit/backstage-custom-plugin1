#!/bin/bash

echo "🛑 Stopping PostgreSQL..."
docker-compose -f docker-compose.postgres.yml down
echo "✓ PostgreSQL stopped"
