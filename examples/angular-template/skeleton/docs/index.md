# ${{ values.name }}

## Overview

${{ values.description }}

## Technology Stack

- **Framework:** Angular ${{ values.angularVersion }}
{% if values.database != 'none' -%}
- **Database:** ${{ values.database | capitalize }}
- **Database Name:** ${{ values.databaseName or values.name }}
{%- endif %}
{% if values.enableVault -%}
- **Secrets Management:** HashiCorp Vault
- **Vault Address:** ${{ values.vaultAddr }}
{%- endif %}

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The application will be available at http://localhost:4200

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/
│   │   └── services/
│   └── environments/
├── angular.json
├── package.json
└── README.md
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

{% if values.database != 'none' -%}
#### Database
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
{%- endif %}

{% if values.enableVault -%}
#### Vault
- `VAULT_ADDR`: Vault server address
- `VAULT_TOKEN`: Vault access token
{%- endif %}

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## Deployment

### Docker

```bash
docker build -t ${{ values.name }} .
docker run -p 80:80 ${{ values.name }}
```

## Links

- [Repository](https://github.com/${{ values.destination.owner }}/${{ values.destination.repo }})
- [CI/CD Pipeline](https://github.com/${{ values.destination.owner }}/${{ values.destination.repo }}/actions)
