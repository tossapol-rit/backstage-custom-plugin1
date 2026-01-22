import React from 'react';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';

export const VaultContent = () => {
  const { entity } = useEntity();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoCard title="Vault Secrets">
          <Typography variant="body1">
            Vault secrets management for {entity.metadata.name}
          </Typography>
          <Typography variant="body2" style={{ marginTop: 16 }}>
            This tab will display Vault secrets and configurations for this entity.
          </Typography>
        </InfoCard>
      </Grid>
      
      <Grid item md={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Secret Paths
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Configure your Vault secret paths here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Access Policies
            </Typography>
            <Typography variant="body2" color="textSecondary">
              View and manage access policies for this component.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
