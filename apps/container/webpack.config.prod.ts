import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/react/module-federation';
import { composePlugins, ModuleFederationConfig, withNx } from '@nx/webpack';

import baseConfig from './module-federation.config';

const prodConfig: ModuleFederationConfig = {
  ...baseConfig,
  remotes: [
    [ 'about', 'http://localhost:4201' ],
    [ 'blog', 'http://localhost:4202' ],
    [ 'store', 'http://localhost:4203' ],
  ],
};

// Nx plugins for webpack to build config object from Nx options and context.
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(prodConfig),
);
