import { vaultPlugin } from './plugin';

describe('vault', () => {
  it('should export plugin', () => {
    expect(vaultPlugin).toBeDefined();
  });
});
