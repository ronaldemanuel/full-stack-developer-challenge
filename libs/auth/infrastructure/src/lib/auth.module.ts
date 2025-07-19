import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AuthService } from '@nx-ddd/auth-domain';
import { AuthWithBetterAuthService } from './better-auth/services/auth-with-better-auth.service.js';
import { BetterAuthDatabaseAdapterFactory } from './better-auth/factories/better-auth-database-adapter.factory.js';
import { BetterAuthFactory } from './better-auth/factories/better-auth.factory.js';
import { DatabaseModule } from '@nx-ddd/database-infrastructure';

@Module({})
export class AuthModule {
  forBetterAuth(): DynamicModule {
    return {
      imports: [DatabaseModule.forDrizzle()],
      module: AuthModule,
      providers: [
        BetterAuthDatabaseAdapterFactory,
        BetterAuthFactory,
        {
          provide: AuthService.TOKEN,
          useClass: AuthWithBetterAuthService,
        },
      ],
      exports: [AuthService.TOKEN],
    };
  }
}
