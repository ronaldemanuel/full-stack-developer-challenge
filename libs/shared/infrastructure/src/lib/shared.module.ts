import type { DynamicModule } from '@nestjs/common';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheableMemory } from 'cacheable';

import { AuthModule } from '@nx-ddd/auth-infrastructure';
import { DatabaseModule } from '@nx-ddd/database-infrastructure';
import { HashService } from '@nx-ddd/shared-domain';

import { CacheableModule } from './cache/cacheable.module';
import { BCryptHashService } from './hash/services/bcrypt-hash.service';

const imports = [
  // JobEventsProducerModule.forAws(),
  CqrsModule.forRoot(),
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
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      global: true,
      imports: [
        ...imports,
        AuthModule.forBetterAuth(),
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
