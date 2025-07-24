import KeyvRedis from '@keyv/redis';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheableMemory } from 'cacheable';
import { ClsModule } from 'nestjs-cls';

import { AuthModule } from '@nx-ddd/auth-infrastructure';
import {
  DatabaseModule,
  DRIZZLE_CONNECTION_NAME,
  DRIZZLE_TOKEN,
} from '@nx-ddd/database-infrastructure';
import { JobEventsProducerModule } from '@nx-ddd/job-events-infra';
import { HashService } from '@nx-ddd/shared-domain';

import { CacheableModule } from './cache/cacheable.module.js';
import { BCryptHashService } from './hash/services/bcrypt-hash.service.js';

@Global()
@Module({
  imports: [
    DatabaseModule.forDrizzle(),
    AuthModule.forBetterAuth(),
    CqrsModule.forRoot(),
    // JobEventsProducerModule.forAws(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const Keyv = require('keyv').default;
        const adapter = new KeyvRedis(process.env['REDIS_URL']);
        const keyv = new Keyv({
          store: adapter,
          useKeyPrefix: false,
          namespace: 'cache',
        });
        const inMemory = new Keyv({
          store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
        });
        return {
          namespace: 'cache',
          stores: [keyv, inMemory],
        };
      },
    }),
    CacheableModule.register(),
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
      provide: HashService.TOKEN,
      useClass: BCryptHashService, // Assuming BCryptHashService is imported from the correct path
    },
  ],
})
export class SharedModule {}
