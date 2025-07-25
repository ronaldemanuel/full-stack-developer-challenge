import type { DynamicModule } from '@nestjs/common';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

import { DATABASE_CONNECTION_NAME } from '@nx-ddd/database-application';

import type { DrizzleDB } from './drizzle/index.js';
import { awsDb } from './drizzle/aws-client.js';
import { DRIZZLE_TOKEN } from './drizzle/constants/index.js';
import { db } from './drizzle/index.js';

@Global()
@Module({})
export class DatabaseModule {
  static forDrizzle(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DRIZZLE_TOKEN,
          useValue: process.env['NEXT_APPS_PROVIDER'] === 'aws' ? awsDb : db,
        },
      ],
      imports: [
        ClsModule.forRoot({
          global: true,
          plugins: [
            new ClsPluginTransactional({
              connectionName: DATABASE_CONNECTION_NAME,
              enableTransactionProxy: true,
              adapter: new TransactionalAdapterDrizzleOrm({
                // the injection token of the Drizzle client instance
                drizzleInstanceToken: DRIZZLE_TOKEN,
              }),
            }),
          ],
        }),
      ],
      exports: [DRIZZLE_TOKEN],
      global: true,
    };
  }
  static forDrizzleTest(db: DrizzleDB): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ClsModule.forRoot({
          global: true,
          plugins: [
            new ClsPluginTransactional({
              connectionName: DRIZZLE_CONNECTION_NAME,
              enableTransactionProxy: true,
              adapter: new TransactionalAdapterDrizzleOrm({
                // the injection token of the Drizzle client instance
                drizzleInstanceToken: DRIZZLE_TOKEN,
              }),
            }),
          ],
        }),
      ],
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
