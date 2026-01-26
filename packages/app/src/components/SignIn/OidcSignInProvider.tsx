import React from 'react';
import { SignInProvider } from '@backstage/core-components';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';

export const oidcProvider: SignInProvider = {
  id: 'oidc',
  title: 'Keycloak',
  message: 'Sign in using Keycloak',
  apiRef: {
    id: 'oidc',
    T: {} as any,
  } as any,
};

export const OidcSignIn = () => {
  const discoveryApi = useApi(discoveryApiRef);
  
  const handleSignIn = async () => {
    const baseUrl = await discoveryApi.getBaseUrl('auth');
    const redirectUrl = `${baseUrl}/oidc/start?env=development`;
    window.location.href = redirectUrl;
  };

  return (
    <button onClick={handleSignIn} style={{
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      marginTop: '20px'
    }}>
      Sign in with Keycloak
    </button>
  );
};
