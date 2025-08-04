import { Injectable } from '@nestjs/common';

import type { DatabaseService } from '../../services/database.service';
import type { DrizzleTestDB } from '../helpers/testing/drizzle-test-db.interface';
import { DrizzleDatabaseService } from './drizzle-database.service';

@Injectable()
export class DrizzleTestDatabaseService
  extends DrizzleDatabaseService
  implements DatabaseService.Service
{
  constructor(private testDb: DrizzleTestDB) {
    super(testDb.db);
  }

  override async teardown(): Promise<void> {
    await super.teardown();
    await this.testDb.container.stop();
    if (this.testDb.proxyContainer) {
      await this.testDb.proxyContainer.stop();
    }
    await this.testDb.network.stop();
  }
}
