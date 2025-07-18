import { drizzleAdapter, type DB } from 'better-auth/adapters/drizzle';

export const BETTER_AUTH_DATABASE_ADAPTER_TOKEN =
  'BETTER_AUTH_DATABASE_ADAPTER';

export const BetterAuthDatabaseAdapterFactory = {
  provide: BETTER_AUTH_DATABASE_ADAPTER_TOKEN,
  useFactory: (db: DB) => {
    return drizzleAdapter(db, {
      provider: 'pg',
    });
  },
  // TODO: inject the db
  inject: [],
};

export const BetterAuthDatabaseTestAdapterFactory = {
  provide: BETTER_AUTH_DATABASE_ADAPTER_TOKEN,
  useFactory: (db: DB) => {
    return drizzleAdapter(db, {
      provider: 'sqlite',
    });
  },
  // TODO: inject the db
  inject: [],
};
