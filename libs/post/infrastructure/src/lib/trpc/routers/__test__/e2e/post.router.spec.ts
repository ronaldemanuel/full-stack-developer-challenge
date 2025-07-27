import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { beforeAll, beforeEach, describe } from 'vitest';

import type { DrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import type { TestingCaller } from '@nx-ddd/shared-infrastructure';
import { AuthService } from '@nx-ddd/auth-domain';
import {
  DatabaseModule,
  DatabaseService,
} from '@nx-ddd/database-infrastructure';
import { setupDrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import {
  PostEntityMockFactory,
  PostRepository,
  UserEntityPostRef,
  UserPostEntityRefFactory,
} from '@nx-ddd/post-domain';
import {
  createTestingCaller,
  SharedModule,
} from '@nx-ddd/shared-infrastructure';
import { UserModule } from '@nx-ddd/user-infrastructure';

import { PostModule } from '../../../../post.module';
import { postsRouter } from '../../post.router';

const records = {
  post: postsRouter,
};

describe('PostRouter', () => {
  let drizzleTestDB: DrizzleTestDB;
  let testModule: TestingModule;
  let databaseService: DatabaseService.Service;
  let authService: AuthService.Service;
  let postRepository: PostRepository.Repository;

  beforeAll(async () => {
    drizzleTestDB = await setupDrizzleTestDB();
  });

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        UserModule,
        SharedModule.forTesting({
          dbModule: DatabaseModule.forDrizzleTest(drizzleTestDB),
        }),
        PostModule,
      ],
    }).compile();
    databaseService = testModule.get<DatabaseService.Service>(
      DatabaseService.TOKEN,
    );
    authService = testModule.get<AuthService.Service>(AuthService.TOKEN);
    postRepository = testModule.get<PostRepository.Repository>(
      PostRepository.TOKEN,
    );
    await databaseService.cleanTables();
    await testModule.init();
  });

  afterAll(async () => {
    await databaseService.teardown();
    await testModule.close();
  });
  describe('When performing authenticated actions to the api', () => {
    let testCaller: TestingCaller<typeof records>;
    let testUser: UserEntityPostRef;

    beforeEach(async () => {
      testUser = UserPostEntityRefFactory();
      const mockPassword = 'password123';
      testUser = UserEntityPostRef.cast(
        await authService.registerUser(testUser, 'credentials', mockPassword),
      );
      vi.spyOn(authService, 'getSession').mockResolvedValue({
        session: {
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
          id: 'test-session-id',
          userId: testUser.id,
          token: 'test-token',
          updatedAt: new Date(),
          activeOrganizationId: null,
          impersonatedBy: null,
          ipAddress: '123123',
          userAgent: 'test-user-agent',
        },
        user: testUser.toJSON(),
      });

      testCaller = await createTestingCaller(records, testModule);
    });

    describe('When toggling post likes', () => {
      it('Should save the post as liked and clear the post route cache', async () => {
        // Arrange
        const fakePostOwner = UserEntityPostRef.cast(
          await authService.registerUser(
            UserPostEntityRefFactory(),
            'credentials',
            'password123',
          ),
        );
        const post = PostEntityMockFactory(
          {
            ownerId: fakePostOwner.id,
          },
          {
            owner: fakePostOwner,
          },
        );
        await postRepository.insert(post);
        const newPostId = (await postRepository.findAll())[0].id;

        // Act
        await testCaller.post.toggleLike({
          postId: newPostId,
        });

        const response = await testCaller.post.getById({
          id: newPostId,
        });

        expect(response.meta).toBeDefined();
        expect(response.meta?.liked).toBe(true);
        expect(response.id).toBe(newPostId);
      });
    });
  });
});
