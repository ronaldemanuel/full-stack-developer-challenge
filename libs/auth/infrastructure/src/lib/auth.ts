/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { db } from '../../../../database/infrastructure/src/drizzle/client';
import { initAuth } from './better-auth/factories/better-auth.factory';

// HACK: Dummy auth for generating the schema
export const auth: any = initAuth(
  {
    baseUrl: '',
    productionUrl: '',
    secret: '',
    githubClientId: '',
    githubClientSecret: '',
    googleClientId: '',
    googleClientSecret: '',
    allowedOrigins: [],
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
