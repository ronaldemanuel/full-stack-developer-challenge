//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const { join } = require('node:path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

if (process.env.NEXT_APPS_PROVIDER === 'aws') {
  nextConfig.output = 'standalone';
  nextConfig.outputFileTracingRoot = join(__dirname, '../../');
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
