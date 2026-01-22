#!/bin/bash

echo "Starting HashiCorp Vault..."
docker-compose -f docker-compose.vault.yml up -d

echo ""
echo "Waiting for Vault to start..."
sleep 3

# Check if Vault is running
if curl -s http://localhost:8200/v1/sys/health > /dev/null 2>&1; then
    echo "✓ Vault is running!"
    echo ""
    echo "Vault UI:    http://localhost:8200"
    echo "Root Token:  myroot"
    echo ""
    echo "Environment variables:"
    echo "  export VAULT_ADDR=http://localhost:8200"
    echo "  export VAULT_TOKEN=myroot"
    echo ""
    echo "To stop: ./vault-stop.sh"
    echo "To view logs: docker logs -f backstage-vault"
else
    echo "✗ Failed to start Vault"
    docker-compose -f docker-compose.vault.yml logs
fi
