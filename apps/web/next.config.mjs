//@ts-check

import './src/env.mjs';
import { composePlugins, withNx } from '@nx/next';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {
    svgr: false,
  },
  serverExternalPackages: [
    '@nx-ddd/api-infrastructure',
    '@nx-ddd/auth-domain',
    '@nx-ddd/auth-infrastructure',
    '@nx-ddd/shared-infrastructure',
    '@nx-ddd/tailwind',

    '@nestjs/core',
    '@nestjs/common',
    '@nestjs/cache-manager',
    '@nestjs/cqrs',
    '@react-email/components',
  ],
};

if (process.env.NEXT_APPS_PROVIDER === 'aws') {
  nextConfig.output = 'standalone';
  nextConfig.outputFileTracingRoot = join(__dirname, '../../');
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
