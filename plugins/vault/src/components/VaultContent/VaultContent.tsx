import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { InfoCard } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

interface Secret {
  key: string;
  value: string | null;
  masked: boolean;
}

interface VaultResponse {
  secrets: Secret[];
  environment: string;
  secretPath: string;
  metadata?: {
    created_time: string;
    version: number;
  };
  message?: string;
}

export const VaultContent = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');

  const { value, loading, error } = useAsync(async () => {
    const namespace = entity.metadata.namespace || 'default';
    const kind = entity.kind.toLowerCase();
    const name = entity.metadata.name;

    const response = await fetch(
      `${backendUrl}/api/vault/secrets/${namespace}/${kind}/${name}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch secrets: ${response.statusText}`);
    }

    return response.json() as Promise<VaultResponse>;
  }, [entity]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoCard title="Vault Secrets">
          <Typography variant="body1">
            Vault secrets management for {entity.metadata.name}
          </Typography>
          {value && (
            <Typography variant="body2" style={{ marginTop: 8 }}>
              Environment: <Chip 
                label={value.environment.toUpperCase()} 
                size="small" 
                color={value.environment === 'development' || value.environment === 'dev' ? 'primary' : 'default'}
              />
              {value.environment !== 'development' && value.environment !== 'dev' && (
                <Typography variant="caption" display="block" style={{ marginTop: 8, color: '#ff9800' }}>
                  ⚠️ Secret values are hidden in {value.environment} environment for security
                </Typography>
              )}
            </Typography>
          )}
        </InfoCard>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Secrets
            </Typography>
            
            {loading && (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <CircularProgress />
              </div>
            )}

            {error && (
              <Alert severity="error">
                Error loading secrets: {error.message}
              </Alert>
            )}

            {value && value.secrets.length === 0 && (
              <Alert severity="info">
                {value.message || 'No secrets found for this entity'}
                {value.secretPath && (
                  <Typography variant="caption" display="block" style={{ marginTop: 8 }}>
                    Path: {value.secretPath}
                  </Typography>
                )}
              </Alert>
            )}

            {value && value.secrets.length > 0 && (
              <>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Path: {value.secretPath}
                </Typography>
                {value.metadata && (
                  <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                    Version: {value.metadata.version} | Created: {new Date(value.metadata.created_time).toLocaleString()}
                  </Typography>
                )}
                <Table size="small" style={{ marginTop: 16 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Key</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {value.secrets.map((secret) => (
                      <TableRow key={secret.key}>
                        <TableCell>{secret.key}</TableCell>
                        <TableCell>
                          {secret.masked ? (
                            <Typography variant="body2" style={{ color: '#999' }}>
                              ••••••••
                            </Typography>
                          ) : (
                            <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
                              {secret.value}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
