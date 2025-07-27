import { neonConfig } from '@neondatabase/serverless';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

import * as schema from './schema';

if (process.env['LOCAL_POSTGRES']) {
  neonConfig.wsProxy = (host) =>
    `${host}:${process.env['DB_PROXY_PORT'] ?? 54330}/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

export const db = drizzle({
  client: sql,
  schema,
  casing: 'snake_case',
});

export type DrizzleDB = typeof db;
