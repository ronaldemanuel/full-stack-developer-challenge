import { Injectable } from '@nestjs/common';
import { reset } from 'drizzle-seed';

import type { DatabaseService } from '../../services/database.service';
import type { DrizzleDB } from '../client';
import { InjectDrizzle } from '../decorators';
import { dbMigrate } from '../helpers';
import * as schema from '../schema';

@Injectable()
export class DrizzleDatabaseService implements DatabaseService.Service {
  constructor(@InjectDrizzle() protected db: DrizzleDB) {}
  async migrate(): Promise<void> {
    return dbMigrate(this.db);
  }
  cleanTables(): Promise<void> {
    return reset(this.db, schema);
  }
  async teardown(): Promise<void> {
    await this.db.$client.end();
  }
}
