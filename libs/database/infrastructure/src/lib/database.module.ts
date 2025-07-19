import type { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import type { DrizzleDB } from './drizzle/index.js';
import { db } from './drizzle/index.js';

import { DRIZZLE_TOKEN } from './drizzle/constants/index.js';

@Global()
@Module({})
export class DatabaseModule {
  static forDrizzle(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DRIZZLE_TOKEN,
          useValue: db,
        },
      ],
      exports: [DRIZZLE_TOKEN],
      global: true,
    };
  }
  static forDrizzleTest(db: DrizzleDB): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DRIZZLE_TOKEN,
          useValue: db,
        },
      ],
      exports: [DRIZZLE_TOKEN],
    };
  }
}
