import {
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const vaultPlugin = createPlugin({
  id: 'vault',
  routes: {
    root: rootRouteRef,
  },
});

export const VaultPage = vaultPlugin.provide(
  createRoutableExtension({
    name: 'VaultPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const EntityVaultContent = vaultPlugin.provide(
  createComponentExtension({
    name: 'EntityVaultContent',
    component: {
      lazy: () =>
        import('./components/VaultContent').then(m => m.VaultContent),
    },
  }),
);
