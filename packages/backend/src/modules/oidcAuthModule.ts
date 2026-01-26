import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
import {
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';

export default createBackendModule({
  pluginId: 'auth',
  moduleId: 'oidc-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'oidc',
          factory: createOAuthProviderFactory({
            authenticator: oidcAuthenticator,
            async signInResolver(info, ctx) {
              const { profile } = info;
              
              // ใช้ preferred_username จาก Keycloak
              const username = profile.email?.split('@')[0] || 'demo';
              
              const userRef = stringifyEntityRef({
                kind: 'User',
                name: username,
                namespace: DEFAULT_NAMESPACE,
              });

              return ctx.issueToken({
                claims: {
                  sub: userRef,
                  ent: [userRef],
                },
              });
            },
          }),
        });
      },
    });
  },
});
