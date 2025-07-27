import { migrate } from 'drizzle-orm/node-postgres/migrator';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { awsDb } from '../../../libs/database/infrastructure/src/drizzle/aws-client';

export const handler = async () => {
  await migrate(awsDb, {
    migrationsFolder: './migrations',
  });
};
