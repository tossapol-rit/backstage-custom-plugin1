import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';
import fetch from 'node-fetch';

export const vaultPlugin = createBackendPlugin({
  pluginId: 'vault',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
      },
      async init({ logger, httpRouter, config }) {
        const router = Router();

        // Get Vault configuration from app-config
        const vaultAddr = config.getOptionalString('vault.address') || 'http://localhost:8200';
        const vaultToken = config.getOptionalString('vault.token') || 'myroot';
        const environment = config.getOptionalString('app.environment') || 'production';

        logger.info(`Vault plugin initialized with environment: ${environment}`);

        // Endpoint to get secrets for a specific entity
        router.get('/secrets/:namespace/:kind/:name', async (req, res) => {
          const { namespace, kind, name } = req.params;
          const entityRef = `${kind}:${namespace}/${name}`;
          
          logger.info(`Fetching Vault secrets for entity: ${entityRef}`);

          try {
            // Construct secret path based on entity and environment
            // Map 'development' to 'dev' for shorter path
            const envPath = environment === 'development' ? 'dev' : environment;
            const secretPath = `secret/data/apps/${envPath}/${name}`;
            
            logger.info(`Fetching secrets from path: ${secretPath}`);
            
            // Fetch secrets from Vault
            const response = await fetch(`${vaultAddr}/v1/${secretPath}`, {
              method: 'GET',
              headers: {
                'X-Vault-Token': vaultToken,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              if (response.status === 404) {
                logger.warn(`No secrets found for ${entityRef} at path ${secretPath}`);
                return res.json({
                  secrets: [],
                  environment,
                  message: 'No secrets found for this entity',
                });
              }
              
              const error = await response.text();
              logger.error(`Failed to fetch secrets: ${error}`);
              return res.status(response.status).json({ 
                error: 'Failed to fetch secrets from Vault',
                details: error,
              });
            }

            const data = await response.json();
            const secrets = data.data?.data || {};

            // Determine if we should show secret values based on environment
            const showValues = environment === 'development' || environment === 'dev';

            // Transform secrets based on environment
            const transformedSecrets = Object.entries(secrets).map(([key, value]) => ({
              key,
              value: showValues ? value : null, // Only send values in dev
              masked: !showValues,
            }));

            logger.info(`Successfully fetched ${transformedSecrets.length} secrets for ${entityRef}`);
            logger.info(`Environment: ${environment}, Show values: ${showValues}`);

            res.json({
              secrets: transformedSecrets,
              environment,
              secretPath,
              metadata: {
                created_time: data.data?.metadata?.created_time,
                version: data.data?.metadata?.version,
              },
            });

          } catch (error) {
            logger.error(`Error fetching Vault secrets: ${error}`);
            res.status(500).json({ 
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        });

        // Health check endpoint
        router.get('/health', (_req, res) => {
          res.json({ 
            status: 'ok',
            environment,
            vaultAddr,
          });
        });

        httpRouter.use(router);
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/secrets',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
