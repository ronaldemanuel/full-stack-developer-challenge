/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { db } from '../../../../database/infrastructure/src/lib/drizzle/client.js';
import { initAuth } from './better-auth/factories/better-auth.factory.js';

// HACK: Dummy auth for generating the schema
export const auth = initAuth(
  {
    baseUrl: '',
    productionUrl: '',
    secret: '',
    githubClientId: '',
    githubClientSecret: '',
    googleClientId: '',
    googleClientSecret: '',
  },
  drizzleAdapter(db, {
    provider: 'pg',
  }) as any,
  {} as any,
  {} as any,
  {} as any,
  {} as any,
  {} as any,
);
