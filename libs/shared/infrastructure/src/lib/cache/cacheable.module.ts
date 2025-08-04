import type { DynamicModule } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Module } from '@nestjs/common';

import {
  setCacheManager,
  setCacheManagerIsv5OrGreater,
} from '@nx-ddd/shared-application';

@Module({})
export class CacheableModule {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    setCacheManagerIsv5OrGreater(true);
    setCacheManager(this.cacheManager);
  }

  static register(): DynamicModule {
    return {
      module: CacheableModule,
    };
  }
}
