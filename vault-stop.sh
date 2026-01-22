#!/bin/bash

echo "Stopping HashiCorp Vault..."
docker-compose -f docker-compose.vault.yml down

echo "✓ Vault stopped"
echo ""
echo "Note: Data is preserved in Docker volume 'vault-data'"
echo "To completely remove data: docker volume rm backstage-custom-plugin1_vault-data"
