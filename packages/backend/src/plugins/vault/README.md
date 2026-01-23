# Vault Backend Plugin

Backend plugin for HashiCorp Vault integration with Backstage.

## Features

- **Environment-based secret visibility**: Shows secret values only in development environment
- **REST API endpoints**: Fetch secrets for specific entities
- **Security**: Production environments (qa, uat, production) only show secret keys, not values

## API Endpoints

### GET `/api/vault/secrets/:namespace/:kind/:name`

Fetch secrets for a specific entity.

**Parameters:**
- `namespace`: Entity namespace (e.g., `default`)
- `kind`: Entity kind (e.g., `component`)
- `name`: Entity name

**Response:**
```json
{
  "secrets": [
    {
      "key": "database_password",
      "value": "secret123",  // null in non-dev environments
      "masked": false         // true in non-dev environments
    }
  ],
  "environment": "development",
  "secretPath": "secret/data/apps/myapp",
  "metadata": {
    "created_time": "2026-01-23T10:00:00Z",
    "version": 1
  }
}
```

### GET `/api/vault/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "environment": "development",
  "vaultAddr": "http://localhost:8200"
}
```

## Configuration

Add to `app-config.yaml`:

```yaml
app:
  environment: development  # Options: development, dev, qa, uat, production

vault:
  address: http://localhost:8200
  token: ${VAULT_TOKEN}
```

## Environment Behavior

| Environment | Secret Values Shown | Use Case |
|------------|---------------------|----------|
| `development` or `dev` | ✅ Yes | Local development |
| `qa`, `uat`, `production` | ❌ No (keys only) | Deployed environments |

## Security Notes

- Backend controls what data is sent to frontend
- Secret values never reach browser in non-dev environments
- Use proper Vault authentication methods in production (not root token)
- Consider implementing RBAC for additional access control
