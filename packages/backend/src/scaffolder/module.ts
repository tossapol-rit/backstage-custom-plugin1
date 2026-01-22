import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { createVaultSecretsAction } from './actions/vault';

export default createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'custom-actions',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
      },
      async init({ scaffolder }) {
        scaffolder.addActions(createVaultSecretsAction());
      },
    });
  },
});
