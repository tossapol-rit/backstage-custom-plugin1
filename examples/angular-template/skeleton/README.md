# ${{ values.name }}

${{ values.description }}

## Technology Stack

- **Angular Version:** ${{ values.angularVersion }}
{% if values.database != 'none' -%}
- **Database:** ${{ values.database | capitalize }}
{%- endif %}
{% if values.enableVault -%}
- **Secrets Management:** HashiCorp Vault
{%- endif %}

## Getting Started

### Prerequisites

- Node.js (18.x or later)
- Angular CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/${{ values.destination.owner }}/${{ values.destination.repo }}.git
cd ${{ values.destination.repo }}
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
npm install
```

{% if values.database != 'none' -%}
4. Configure database in `.env` file
{%- endif %}
{% if values.enableVault -%}
5. **Initialize Vault secrets (IMPORTANT - Run this manually):**
```bash
chmod +x vault-init.sh
./vault-init.sh
```

**Note:** The GitHub Actions workflow will fail because Vault is running locally (localhost:8200).
GitHub Actions cannot access your local Vault. Always run `vault-init.sh` manually on your machine.
{%- endif %}

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

{% if values.enableVault -%}

## Vault Configuration

This application uses HashiCorp Vault for secrets management.

### Initial Secrets

{% if values.vaultSecrets -%}
The following secrets were configured during project creation:
```json
${{ values.vaultSecrets }}
```

These secrets are stored at: `secret/apps/${{ values.name }}`

**To initialize them in Vault (MUST RUN MANUALLY):**
```bash
./vault-init.sh
```

**Important Notes:**
- This script must be run on your local machine where Vault is accessible
- The GitHub Actions workflow will **fail** because it cannot access localhost:8200
- Only use GitHub Actions if your Vault is publicly accessible (not recommended for local development)

**To verify secrets were created:**
```bash
export VAULT_ADDR=${{ values.vaultAddr }}
export VAULT_TOKEN=${{ values.vaultToken }}
vault kv get secret/apps/${{ values.name }}
```
{%- else -%}
No initial secrets were configured. You can add secrets manually:
```bash
export VAULT_ADDR=${{ values.vaultAddr }}
export VAULT_TOKEN=${{ values.vaultToken }}
vault kv put secret/apps/${{ values.name }} key=value
```
{%- endif %}

### Setup

1. Configure Vault connection in `.env`:
```bash
VAULT_ADDR=${{ values.vaultAddr }}
VAULT_TOKEN=${{ values.vaultToken }}
```

2. Vault secrets path: `secret/data/apps/${{ values.name }}`

### Usage in Code

```typescript
import { VaultService } from './services/vault.service';

// Read secret
const secret = await this.vaultService.readSecret('my-secret');

// Write secret
await this.vaultService.writeSecret('my-secret', { key: 'value' });

// List secrets
const secrets = await this.vaultService.listSecrets('');
```
{%- endif %}

{% if values.database != 'none' -%}

## Database Configuration

Database: **${{ values.database | capitalize }}**
Database Name: **${{ values.databaseName or values.name }}**

### Setup

1. Configure database connection in `.env`:
```bash
DB_HOST=localhost
{% if values.database == 'postgresql' -%}
DB_PORT=5432
DB_NAME=${{ values.databaseName or values.name }}
DB_USER=postgres
DB_PASSWORD=postgres
{%- elif values.database == 'mysql' -%}
DB_PORT=3306
DB_NAME=${{ values.databaseName or values.name }}
DB_USER=root
DB_PASSWORD=password
{%- elif values.database == 'mongodb' -%}
MONGODB_URI=mongodb://localhost:27017/${{ values.databaseName or values.name }}
{%- endif %}
```

### Usage

```typescript
import { DatabaseService } from './services/database.service';

{% if values.database == 'postgresql' or values.database == 'mysql' -%}
// Execute query
const results = await this.databaseService.query('SELECT * FROM users');
{%- elif values.database == 'mongodb' -%}
// Get collection
const users = this.databaseService.getCollection('users');
const results = await users.find({}).toArray();
{%- endif %}
```
{%- endif %}

## Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## Running Tests

```bash
npm test
```

## Repository

- **GitHub:** https://github.com/${{ values.destination.owner }}/${{ values.destination.repo }}

## CI/CD

This project uses GitHub Actions for continuous integration:

### Workflows:
- **CI**: Runs on every push to main branch
  - Install dependencies
  - Lint code
  - Build application
  - Run tests

{% if values.enableVault -%}
- **Initialize Vault Secrets**: Manual workflow only
  - ⚠️ Will fail if Vault is not publicly accessible
  - Use local `vault-init.sh` script instead for localhost Vault
{%- endif %}

### First-time Setup:
After the first push, the CI might fail. To fix:
1. Run `npm install` locally
2. Commit `package-lock.json` if generated
3. Push again
