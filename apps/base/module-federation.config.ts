import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'base',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;
