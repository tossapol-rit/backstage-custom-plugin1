import { createDevApp } from '@backstage/dev-utils';
import { vaultPlugin, VaultPage } from '../src/plugin';

createDevApp()
  .registerPlugin(vaultPlugin)
  .addPage({
    element: <VaultPage />,
    title: 'Root Page',
    path: '/vault',
  })
  .render();
