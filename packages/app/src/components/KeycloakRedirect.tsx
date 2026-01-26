import React, { useEffect } from 'react';
import { Progress } from '@backstage/core-components';
import { useApi, discoveryApiRef } from '@backstage/core-plugin-api';

export const KeycloakRedirect = () => {
  const discoveryApi = useApi(discoveryApiRef);

  useEffect(() => {
    const redirect = async () => {
      const baseUrl = await discoveryApi.getBaseUrl('auth');
      const oidcUrl = `${baseUrl}/oidc/start?env=development`;
      window.location.href = oidcUrl;
    };
    
    redirect();
  }, [discoveryApi]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '20px'
    }}>
      <Progress />
      <p>Redirecting to Keycloak...</p>
    </div>
  );
};
