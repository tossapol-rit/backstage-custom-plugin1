# Architecture

## Application Structure

This Angular application follows a modular architecture with clear separation of concerns.

### Components

- **App Component**: Root component that bootstraps the application
- Additional components can be added in `src/app/components/`

### Services

{% if values.database != 'none' -%}
#### Database Service

The `DatabaseService` provides methods to interact with the ${{ values.database | capitalize }} database.

**Location:** `src/app/services/database.service.ts`

**Usage:**
```typescript
import { DatabaseService } from './services/database.service';

// Inject in constructor
constructor(private db: DatabaseService) {}

// Use the service
{% if values.database == 'postgresql' or values.database == 'mysql' -%}
const results = await this.db.query('SELECT * FROM users');
{%- elif values.database == 'mongodb' -%}
const collection = this.db.getCollection('users');
const results = await collection.find({}).toArray();
{%- endif %}
```
{%- endif %}

{% if values.enableVault -%}
#### Vault Service

The `VaultService` provides methods to interact with HashiCorp Vault for secrets management.

**Location:** `src/app/services/vault.service.ts`

**Usage:**
```typescript
import { VaultService } from './services/vault.service';

// Inject in constructor
constructor(private vault: VaultService) {}

// Read secret
const secret = await this.vault.readSecret('my-secret');

// Write secret
await this.vault.writeSecret('my-secret', { key: 'value' });

// List secrets
const secrets = await this.vault.listSecrets('');
```
{%- endif %}

## Environment Configuration

Configuration is managed through environment files:

- `src/environments/environment.ts` - Development settings
- `src/environments/environment.prod.ts` - Production settings

## Build Process

The application uses Angular CLI for building:

1. **Development Build**: `ng serve` - with hot reload
2. **Production Build**: `ng build --configuration production` - optimized bundle
3. **Docker Build**: Multi-stage build for containerized deployment

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) handles:

- **Linting**: Code quality checks
- **Testing**: Unit and integration tests
- **Building**: Production build
- **Docker**: Container image creation
