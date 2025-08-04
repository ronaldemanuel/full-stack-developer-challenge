/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import type { TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import type { DrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import { AuthApplicationModule } from '@nx-ddd/auth-application';
import { AuthService } from '@nx-ddd/auth-domain';
import {
  DatabaseModule,
  DatabaseService,
} from '@nx-ddd/database-infrastructure';
import { setupDrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import { UserEntityMockFactory } from '@nx-ddd/user-domain';

import type { BetterAuthConfig } from '../../../factories/better-auth.factory';
import { BetterAuthDatabaseAdapterFactory } from '../../../factories/better-auth-database-adapter.factory';
import {
  BETTER_AUTH_CONFIG_TOKEN,
  BetterAuthFactory,
} from '../../../factories/better-auth.factory';
import { AuthWithBetterAuthService } from '../../auth-with-better-auth.service';

describe('AuthWithBetterAuthService', () => {
  let authService: AuthService.Service;
  let testDb: DrizzleTestDB;
  let moduleRef: TestingModule;
  let dbService: DatabaseService.Service;

  beforeAll(async () => {
    testDb = await setupDrizzleTestDB();
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule.forDrizzleTest(testDb),
        AuthApplicationModule,
        CqrsModule.forRoot(),
      ], // Add
      controllers: [], // Add
      providers: [
        {
          provide: BETTER_AUTH_CONFIG_TOKEN,
          useValue: {
            baseUrl: 'http://localhost:3000',
            productionUrl: 'http://localhost:3000',
            secret: 'secret',
            googleClientId: 'mock-google-client-id',
            googleClientSecret: 'mock-google-client-secret',
            githubClientId: 'mock-github-client-id',
            githubClientSecret: 'mock-github',
            allowedOrigins: ['http://localhost:3000'],
          } satisfies BetterAuthConfig,
        },
        BetterAuthDatabaseAdapterFactory,
        BetterAuthFactory,
        {
          provide: AuthService.TOKEN,
          useClass: AuthWithBetterAuthService, // Use the service directly
        },
      ], // Add
    }).compile();
    dbService = moduleRef.get<DatabaseService.Service>(DatabaseService.TOKEN);
    authService = moduleRef.get<AuthService.Service>(AuthService.TOKEN);
    await dbService.cleanTables();
  });

  afterAll(async () => {
    await dbService.teardown();
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registerUser', () => {
    describe('When registering a user with email and password', () => {
      it('should register the user and return a session', async () => {
        const mockPassword = 'password123';
        const user = UserEntityMockFactory();
        const headers = new Headers();
        const registered = await authService.registerUser(
          user,
          'credentials',
          mockPassword,
          true,
          headers,
        );
        expect(registered).toBeDefined();
        expect(registered.email).toBe(user.email.toLocaleLowerCase());
        expect(registered.name).toBe(user.name);
        expect(registered.id).toBeDefined();
      });
    });
    describe('When registering a user with social provider', () => {
      it('should throw an error if register is not allowed', async () => {
        const user = UserEntityMockFactory();
        const provider = 'google'; // Example social provider
        await expect(
          authService.registerUser(user, provider, true),
        ).rejects.toThrowError(
          `Register is not allowed for provider ${provider}. Use credentials instead.`,
        );
      });
    });
  });
});
