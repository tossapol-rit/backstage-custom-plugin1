import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fetch from 'node-fetch';

export const createVaultSecretsAction = () => {
  return createTemplateAction({
    id: 'vault:create-secrets',
    description: 'Create secrets in HashiCorp Vault',
    schema: {
      input: {
        type: 'object',
        required: ['vaultAddr', 'vaultToken', 'secretPath', 'secrets'],
        properties: {
          vaultAddr: {
            type: 'string',
            title: 'Vault Address',
            description: 'HashiCorp Vault server address',
          },
          vaultToken: {
            type: 'string',
            title: 'Vault Token',
            description: 'Vault authentication token',
          },
          secretPath: {
            type: 'string',
            title: 'Secret Path',
            description: 'Path where secrets will be stored (e.g., apps/myapp)',
          },
          secrets: {
            type: 'object',
            title: 'Secrets',
            description: 'Key-value pairs of secrets to store',
          },
        },
      },
    },
    async handler(ctx) {
      const { vaultAddr, vaultToken, secretPath, secrets: rawSecrets } = ctx.input;

      // Skip if secrets is empty or empty string
      if (!rawSecrets || rawSecrets === '' || (typeof rawSecrets === 'string' && rawSecrets.trim() === '')) {
        ctx.logger.info(`Skipping Vault secrets creation - no secrets provided`);
        return;
      }

      // Parse secrets if it's a string
      let secrets = rawSecrets;
      if (typeof rawSecrets === 'string') {
        try {
          secrets = JSON.parse(rawSecrets);
        } catch (error) {
          ctx.logger.error(`Failed to parse secrets JSON: ${error}`);
          throw new Error(`Invalid JSON format for secrets: ${error}`);
        }
      }

      // Skip if secrets is empty object
      if (!secrets || typeof secrets !== 'object' || Object.keys(secrets).length === 0) {
        ctx.logger.info(`Skipping Vault secrets creation - no secrets provided`);
        return;
      }

      ctx.logger.info(`Creating secrets in Vault at ${secretPath}`);
      ctx.logger.info(`Vault Address: ${vaultAddr}`);
      ctx.logger.info(`Secrets to create: ${JSON.stringify(secrets)}`);

      // Best Practice: Always create initial secrets in 'dev' environment
      // Production/QA/UAT secrets should be created separately with different values
      const environment = 'dev';
      const fullSecretPath = `secret/data/apps/${environment}/${secretPath}`;
      
      ctx.logger.info(`Creating initial secrets in development environment: ${fullSecretPath}`);

      try {
        const response = await fetch(
          `${vaultAddr}/v1/${fullSecretPath}`,
          {
            method: 'POST',
            headers: {
              'X-Vault-Token': vaultToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: secrets }),
          }
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to create secrets: ${error}`);
        }

        const result = await response.json();
        ctx.logger.info(`Secrets created successfully. Version: ${result.data.version}`);

        ctx.output('version', result.data.version);
        ctx.output('created_time', result.data.created_time);
      } catch (error) {
        ctx.logger.error(`Error creating Vault secrets: ${error}`);
        throw error;
      }
    },
  });
};
