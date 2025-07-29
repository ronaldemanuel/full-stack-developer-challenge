import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type { DrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import { getDatabaseTransactionToken } from '@nx-ddd/database-application';
import {
  DatabaseModule,
  DatabaseService,
  DRIZZLE_TOKEN,
} from '@nx-ddd/database-infrastructure';
import { setupDrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import { ItemRepository } from '@nx-ddd/item-domain';
import { UserModule } from '@nx-ddd/user-infrastructure';

import { ItemDrizzleRepository } from '../../item-drizzle.repository';

describe('ItemDrizzleRepository', () => {
  let drizzleTestDB: DrizzleTestDB;
  let testModule: TestingModule;
  let itemDrizzleRepository: ItemRepository.Repository;
  let databaseService: DatabaseService.Service;

  beforeAll(async () => {
    drizzleTestDB = await setupDrizzleTestDB();
  });

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [DatabaseModule.forDrizzleTest(drizzleTestDB), UserModule],
      providers: [
        {
          provide: ItemRepository.TOKEN,
          useFactory: (
            drizzle: DrizzleDB,
            drizzleTX: DrizzleTX,
            itemRepository: ItemRepository.Repository,
          ) => {
            return new ItemDrizzleRepository(
              drizzle,
              drizzleTX,
              itemRepository,
            );
          },
          inject: [DRIZZLE_TOKEN, getDatabaseTransactionToken()],
        },
      ],
    }).compile();

    itemDrizzleRepository = testModule.get<ItemRepository.Repository>(
      ItemRepository.TOKEN,
    );
    databaseService = testModule.get<DatabaseService.Service>(
      DatabaseService.TOKEN,
    );
    await databaseService.cleanTables();
  });

  afterAll(async () => {
    // await databaseService.teardown();
    await testModule.close();
  });

  it('should be defined', () => {
    expect(itemDrizzleRepository).toBeDefined();
  });
});
