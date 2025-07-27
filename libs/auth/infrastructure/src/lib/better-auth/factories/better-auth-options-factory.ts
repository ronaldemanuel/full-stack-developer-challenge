import type { FactoryProvider } from '@nestjs/common';

import type { BetterAuthConfig } from './better-auth.factory';
import { env } from '../../../env';
import { BETTER_AUTH_CONFIG_TOKEN } from './better-auth.factory';

export const EnvVarsBetterAuthOptionsFactory: FactoryProvider = {
  provide: BETTER_AUTH_CONFIG_TOKEN,
  useFactory: () => {
    return {
      baseUrl: env.BASE_URL,
      productionUrl: env.BASE_URL,
      secret: env.AUTH_SECRET,
      googleClientId: env.AUTH_GOOGLE_ID,
      googleClientSecret: env.AUTH_GOOGLE_SECRET,
      githubClientId: env.AUTH_GITHUB_ID,
      githubClientSecret: env.AUTH_GITHUB_SECRET,
      allowedOrigins: [...env.CORS_ALLOWED_ORIGINS],
    } satisfies BetterAuthConfig;
  },
};

export const MockBetterAuthOptionsFactory: FactoryProvider = {
  provide: BETTER_AUTH_CONFIG_TOKEN,
  useFactory: () => {
    return {
      baseUrl: 'http://localhost:3000',
      productionUrl: 'http://localhost:3000',
      secret: 'secret',
      googleClientId: 'mock-google-client-id',
      googleClientSecret: 'mock-google-client-secret',
      githubClientId: 'mock-github-client-id',
      githubClientSecret: 'mock-github-client-secret',
      allowedOrigins: ['http://localhost:3000'],
    } satisfies BetterAuthConfig;
  },
};
