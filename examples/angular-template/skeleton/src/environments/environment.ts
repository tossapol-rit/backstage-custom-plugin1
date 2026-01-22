export const environment = {
  production: false,
  appName: '${{ values.name }}',
  {% if values.enableVault -%}
  vault: {
    address: '${{ values.vaultAddr }}',
    token: '${{ values.vaultToken }}',
    secretPath: 'secret/data/apps/${{ values.name }}'
  },
  {%- endif %}
  {% if values.database == 'postgresql' -%}
  database: {
    type: 'postgresql',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    database: '${{ values.databaseName or values.name }}',
    username: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'postgres'
  }
  {%- endif %}
  {% if values.database == 'mysql' -%}
  database: {
    type: 'mysql',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '3306'),
    database: '${{ values.databaseName or values.name }}',
    username: process.env['DB_USER'] || 'root',
    password: process.env['DB_PASSWORD'] || 'root'
  }
  {%- endif %}
  {% if values.database == 'mongodb' -%}
  database: {
    type: 'mongodb',
    uri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/${{ values.databaseName or values.name }}'
  }
  {%- endif %}
};
