#!/bin/bash

# Vault Initialization Script
# This script initializes secrets in HashiCorp Vault for ${{ values.name }}

{% if values.enableVault -%}
VAULT_ADDR="${{ values.vaultAddr }}"
VAULT_TOKEN="${{ values.vaultToken }}"
PROJECT_NAME="${{ values.name }}"
SECRET_PATH="secret/apps/${PROJECT_NAME}"
SECRET_API_PATH="secret/data/apps/${PROJECT_NAME}"

echo "🔐 Initializing Vault secrets for ${PROJECT_NAME}..."
echo ""

# Check if Vault is accessible
if ! curl -s -f -H "X-Vault-Token: ${VAULT_TOKEN}" "${VAULT_ADDR}/v1/sys/health" > /dev/null 2>&1; then
  echo "❌ Error: Cannot connect to Vault at ${VAULT_ADDR}"
  echo "Please ensure Vault is running and the token is valid."
  echo ""
  echo "For local Vault:"
  echo "  ./vault-start.sh"
  exit 1
fi

echo "✓ Connected to Vault"

{% if values.vaultSecrets -%}
# Parse and create secrets
SECRETS='${{ values.vaultSecrets }}'

# Validate JSON format
if ! echo "${SECRETS}" | jq empty 2>/dev/null; then
  echo "❌ Error: Invalid JSON format for secrets"
  exit 1
fi

echo "Creating secrets at ${SECRET_PATH}..."

# Create secrets in Vault (using KV v2 API path)
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "X-Vault-Token: ${VAULT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"data\": ${SECRETS}}" \
  "${VAULT_ADDR}/v1/${SECRET_API_PATH}")

HTTP_CODE=$(echo "${RESPONSE}" | tail -n1)

if [ "${HTTP_CODE}" -eq 200 ] || [ "${HTTP_CODE}" -eq 204 ]; then
  echo "✓ Secrets created successfully"
  echo ""
  echo "Secret path: ${SECRET_PATH}"
  echo "Secrets stored:"
  echo "${SECRETS}" | jq -r 'keys[]' | while read key; do
    echo "  - ${key}"
  done
else
  echo "❌ Error: Failed to create secrets (HTTP ${HTTP_CODE})"
  echo "${RESPONSE}" | head -n-1
  exit 1
fi
{%- else -%}
echo "⚠️  No initial secrets provided"
echo "You can add secrets later using:"
echo "  vault kv put ${SECRET_PATH} key=value"
{%- endif %}

echo ""
echo "✅ Vault initialization complete!"
echo ""
echo "To view secrets:"
echo "  export VAULT_ADDR=${VAULT_ADDR}"
echo "  export VAULT_TOKEN=${VAULT_TOKEN}"
echo "  vault kv get ${SECRET_PATH}"
{%- else -%}
echo "Vault is not enabled for this project"
{%- endif %}
