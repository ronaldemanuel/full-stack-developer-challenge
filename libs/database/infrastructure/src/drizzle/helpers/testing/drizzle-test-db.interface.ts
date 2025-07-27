import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import type { StartedNetwork, StartedTestContainer } from 'testcontainers';

import type { DrizzleDB } from '../../client';

export interface DrizzleTestDB {
  db: DrizzleDB;
  container: StartedPostgreSqlContainer;
  proxyContainer?: StartedTestContainer;
  network: StartedNetwork;
}
