import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/react/module-federation';
import { composePlugins, ModuleFederationConfig, withNx } from '@nx/webpack';

import baseConfig from './module-federation.config';

const prodConfig: ModuleFederationConfig = {
  ...baseConfig,
  remotes: [
    [ 'about', 'https://main--sunny-gecko-6e64d0.netlify.app/' ],
    [ 'blog', 'https://stately-heliotrope-10bfb0.netlify.app/' ],
    [ 'store', 'https://unrivaled-llama-15559c.netlify.app/' ],
    [ 'base', 'https://scintillating-basbousa-9a4c7e.netlify.app/' ],
  ],
};

// Nx plugins for webpack to build config object from Nx options and context.
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(prodConfig),
);
