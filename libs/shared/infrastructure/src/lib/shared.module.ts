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

@Global()
@Module({
  imports: [
    DatabaseModule.forDrizzle(),
    AuthModule.forBetterAuth(),
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
  ],
  providers: [
    {
      provide: HashService.TOKEN,
      useClass: BCryptHashService, // Assuming BCryptHashService is imported from the correct path
    },
  ],
})
export class SharedModule {}
