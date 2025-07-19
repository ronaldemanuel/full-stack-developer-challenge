import type { FactoryProvider } from '@nestjs/common';
import { drizzleAdapter, type DB } from 'better-auth/adapters/drizzle';
import { DRIZZLE_TOKEN } from '@nx-ddd/database-infrastructure';
export const BETTER_AUTH_DATABASE_ADAPTER_TOKEN =
  'BETTER_AUTH_DATABASE_ADAPTER';

export const BetterAuthDatabaseAdapterFactory: FactoryProvider = {
  provide: BETTER_AUTH_DATABASE_ADAPTER_TOKEN,
  useFactory: (db: DB) => {
    return drizzleAdapter(db, {
      provider: 'pg',
    });
  },
  // TODO: inject the db
  inject: [DRIZZLE_TOKEN],
};

export const BetterAuthDatabaseTestAdapterFactory: FactoryProvider = {
  provide: BETTER_AUTH_DATABASE_ADAPTER_TOKEN,
  useFactory: (db: DB) => {
    return drizzleAdapter(db, {
      provider: 'sqlite',
    });
  },
  // TODO: inject the db
  inject: [],
};
