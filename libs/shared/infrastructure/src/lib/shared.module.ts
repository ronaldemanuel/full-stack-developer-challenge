import type { DynamicModule, Type } from '@nestjs/common';
import KeyvRedis, { createCluster } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CacheableMemory } from 'cacheable';

import { AuthModule } from '@nx-ddd/auth-infrastructure';
import { DatabaseModule } from '@nx-ddd/database-infrastructure';
import { JobEventsProducerModule } from '@nx-ddd/jobs-events-infrastructure';
import { HashService } from '@nx-ddd/shared-domain';

import { CacheableModule } from './cache/cacheable.module';
import { BCryptHashService } from './hash/services/bcrypt-hash.service';

const imports = [
  JobEventsProducerModule.forRoot(),
  CacheModule.registerAsync({
    isGlobal: true,
    useFactory: async () => {
      const Keyv = require('keyv').default;
      const cluster = createCluster({
        rootNodes: [
          {
            url: process.env['REDIS_URL'],
            socket: {
              tls: true, // Enable TLS connection
              rejectUnauthorized: false,
            },
          },
        ],
      });
      const singleRedisConnection =
        process.env['REDIS_URL'] || 'redis://localhost:6379';

      const adapter = new KeyvRedis(
        singleRedisConnection.includes('localhost')
          ? singleRedisConnection
          : cluster,
      );
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
];

const providers = [
  {
    provide: HashService.TOKEN,
    useClass: BCryptHashService, // Assuming BCryptHashService is imported from the correct path
  },
];

@Global()
@Module({})
export class SharedModule {
  static forRoot(itemModule: Type): DynamicModule {
    const authModule = AuthModule.forBetterAuth();
    return {
      module: SharedModule,
      global: true,
      imports: [
        ...imports,
        {
          ...authModule,
          imports: [itemModule, ...(authModule.imports as any)],
        },
        DatabaseModule.forDrizzle(),
      ],
      providers,
    };
  }
  static forTesting({ dbModule }: { dbModule: DynamicModule }): DynamicModule {
    return {
      module: SharedModule,
      global: true,
      imports: [...imports, AuthModule.forBetterAuthTest(), dbModule],
      providers,
    };
  }
}
