import type { DynamicModule, Provider, Type } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { AuthApplicationModule } from '@nx-ddd/auth-application';
import { AuthService } from '@nx-ddd/auth-domain';
import {
  InventoryInMemoryRepository,
  InventoryRepository,
} from '@nx-ddd/item-domain';

import { BetterAuthDatabaseAdapterFactory } from './better-auth/factories/better-auth-database-adapter.factory';
import {
  EnvVarsBetterAuthOptionsFactory,
  MockBetterAuthOptionsFactory,
} from './better-auth/factories/better-auth-options-factory';
import { BetterAuthFactory } from './better-auth/factories/better-auth.factory';
import { AuthWithBetterAuthService } from './better-auth/services/auth-with-better-auth.service';

const providers: Provider[] = [
  BetterAuthDatabaseAdapterFactory,
  BetterAuthFactory,
  {
    provide: AuthService.TOKEN,
    useClass: AuthWithBetterAuthService,
  },
];

const imports: Array<Type | DynamicModule> = [AuthApplicationModule];

const exported = [AuthService.TOKEN];

@Module({})
export class AuthModule {
  static forBetterAuth(): DynamicModule {
    return {
      imports: imports,
      module: AuthModule,
      providers: [EnvVarsBetterAuthOptionsFactory, ...providers],
      exports: exported,
    };
  }
  static forBetterAuthTest(): DynamicModule {
    return {
      imports: imports,
      module: AuthModule,
      providers: [
        MockBetterAuthOptionsFactory,
        {
          provide: InventoryRepository.TOKEN,
          useClass: InventoryInMemoryRepository,
        },
        ...providers,
      ],
      exports: exported,
    };
  }
}
