import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';

import type { DrizzleDB } from '../client.js';

// Determine the path to your migrations folder relative to this setup file
const migrationsFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  '../drizzle'
);

export function dbMigrate(db: DrizzleDB) {
  return migrate(db, { migrationsFolder });
}
