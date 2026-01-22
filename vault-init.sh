#!/bin/bash

export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN=myroot

echo "Initializing Vault with sample data..."
echo ""

# Enable KV v2 secrets engine
echo "Enabling KV v2 secrets engine..."
vault secrets enable -version=2 kv 2>/dev/null || echo "KV engine already enabled"

# Create sample secrets for backstage
echo "Creating sample secrets..."

# Secrets for example-website component
vault kv put kv/backstage/example-website \
  database_url="postgresql://user:pass@localhost:5432/example" \
  api_key="sk_test_1234567890" \
  environment="development"

# Secrets for production
vault kv put kv/backstage/example-website/prod \
  database_url="postgresql://user:pass@prod-db:5432/example" \
  api_key="sk_live_9876543210" \
  environment="production"

# Generic secrets
vault kv put kv/backstage/common \
  smtp_host="smtp.example.com" \
  smtp_port="587" \
  slack_webhook="https://hooks.slack.com/services/xxx"

echo ""
echo "✓ Sample secrets created!"
echo ""
echo "List secrets:"
echo "  vault kv list kv/backstage"
echo ""
echo "Read secret:"
echo "  vault kv get kv/backstage/example-website"
