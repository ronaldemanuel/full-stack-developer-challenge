/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// cspell:words neondatabase postgre wsproxy
import { neonConfig } from '@neondatabase/serverless';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { createPool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { reset } from 'drizzle-seed';
import { GenericContainer, Network } from 'testcontainers';
import * as schema from '../../schema.js';
import type { DrizzleDB } from '../../client.js';
import { dbMigrate } from '../migrate.js';

export interface DrizzleTestDB {
  db: DrizzleDB;
  cleanTables: () => Promise<void>;
  teardown: () => Promise<void>;
}

export async function setupDrizzleTestDB(): Promise<DrizzleTestDB> {
  const env = {
    DB_PASS: process.env.DB_PASS!,
    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: process.env.DB_PORT!,
  };

  const containersNetwork = await new Network().start();

  const pgContainer = await new PostgreSqlContainer('postgres:16')
    .withNetwork(containersNetwork)
    .withDatabase(env.DB_NAME)
    .withUsername(env.DB_USER)
    .withPassword(env.DB_PASS)
    .start();
  env.DB_HOST = pgContainer.getHost();
  env.DB_PORT = pgContainer.getPort().toString();

  const pgProxyContainer = await new GenericContainer(
    'ghcr.io/neondatabase/wsproxy:latest'
  )
    .withNetwork(containersNetwork)
    .withEnvironment({
      APPEND_PORT: `${pgContainer.getHostname()}:5432`,
      ALLOW_ADDR_REGEX: '.*',
      LOG_TRAFFIC: 'true',
    })
    .withExposedPorts(80)
    .start();

  neonConfig.wsProxy = (host) =>
    `${host}:${pgProxyContainer.getMappedPort(80)}/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;

  const sql = createPool({
    connectionString: pgContainer.getConnectionUri(),
  });

  const db = drizzle({
    client: sql,
    schema,
    casing: 'snake_case',
  }) as DrizzleDB;

  await dbMigrate(db);

  return {
    db,
    cleanTables: async () => {
      await reset(db, schema);
    },
    teardown: async () => {
      await db.$client.end();

      await pgProxyContainer.stop();
      await pgContainer.stop();
      await containersNetwork.stop();
    },
  };
}
