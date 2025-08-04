/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type { DrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import type { UserRepository } from '@nx-ddd/user-domain';
import { getDatabaseTransactionToken } from '@nx-ddd/database-application';
import {
  DatabaseModule,
  DatabaseService,
  DRIZZLE_TOKEN,
} from '@nx-ddd/database-infrastructure';
import {
  eq,
  setupDrizzleTestDB,
} from '@nx-ddd/database-infrastructure/drizzle/operators';
import {
  like as likeSchema,
  post as postSchema,
  user as userSchema,
} from '@nx-ddd/database-infrastructure/drizzle/schema';
import {
  LikeEntity,
  PostEntityMockFactory,
  PostRepository,
  UserPostEntityRefFactory,
} from '@nx-ddd/post-domain';
import { UserModule } from '@nx-ddd/user-infrastructure';

import { PostDrizzleRepository } from '../../post-drizzle.repository';

describe('PostDrizzleRepository', () => {
  let drizzleTestDB: DrizzleTestDB;
  let testModule: TestingModule;
  let postDrizzleRepository: PostRepository.Repository;
  let databaseService: DatabaseService.Service;

  beforeAll(async () => {
    drizzleTestDB = await setupDrizzleTestDB();
  });

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [DatabaseModule.forDrizzleTest(drizzleTestDB), UserModule],
      providers: [
        {
          provide: PostRepository.TOKEN,
          useFactory: (drizzle: DrizzleDB, drizzleTX: DrizzleTX) => {
            return new PostDrizzleRepository(drizzle, drizzleTX);
          },
          inject: [DRIZZLE_TOKEN, getDatabaseTransactionToken()],
        },
      ],
    }).compile();

    postDrizzleRepository = testModule.get<PostRepository.Repository>(
      PostRepository.TOKEN,
    );
    databaseService = testModule.get<DatabaseService.Service>(
      DatabaseService.TOKEN,
    );
    await databaseService.cleanTables();
  });

  afterAll(async () => {
    await databaseService.teardown();
    await testModule.close();
  });

  it('should be defined', () => {
    expect(postDrizzleRepository).toBeDefined();
  });

  describe('insert', () => {
    it('should insert a post', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );
      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      // Act
      await postDrizzleRepository.insert(postEntity);

      // Assert
      const results = await drizzleTestDB.db.query.post.findMany();
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe(postEntity.title);
      expect(results[0].content).toBe(postEntity.content);
    });
  });

  describe('findById', () => {
    it('should find a post by id', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // We need to insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      // Act
      const foundPost = await postDrizzleRepository.findById(postEntity.id);

      // Assert
      expect(foundPost).toBeDefined();
      expect(foundPost.id).toBe(postEntity.id);
      expect(foundPost.title).toBe(postEntity.title);
      expect(foundPost.content).toBe(postEntity.content);
    });

    it('should throw NotFoundError when post does not exist', async () => {
      // Act & Assert
      await expect(
        postDrizzleRepository.findById('non-existent-id'),
      ).rejects.toThrowError();
    });

    it('should find a post with liked status for a specific user', async () => {
      // Arrange
      const likeUserId = 'like-user-id';
      const userEntity = UserPostEntityRefFactory(
        undefined,
        undefined,
        likeUserId,
      );
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      // Insert the post
      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      const like = LikeEntity.create(userEntity, postEntity);

      // Insert a like for this post by the specified user
      await drizzleTestDB.db.execute(
        drizzleTestDB.db.insert(likeSchema).values({
          ...like.toJSON(),
        }),
      );

      // Act
      const postAggregate = await postDrizzleRepository.findById(
        postEntity.id,
        {
          likedByUserId: likeUserId,
        },
      );

      // Assert
      expect(postAggregate).toBeDefined();
      expect(postAggregate.post.id).toBe(postEntity.id);
      expect(postAggregate.liked).toBe(true);
    });

    it('should return not liked status when user has not liked the post', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );
      const likeUserId = 'like-user-id';

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      // Insert the post without any likes
      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      // Act
      const postAggregate = await postDrizzleRepository.findById(
        postEntity.id,
        {
          likedByUserId: likeUserId,
        },
      );

      // Assert
      expect(postAggregate).toBeDefined();
      expect(postAggregate.post.id).toBe(postEntity.id);
      expect(postAggregate.liked).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should find all posts', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity1 = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );
      const postEntity2 = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values([
        {
          ...postEntity1.toJSON(),
          onwerId: userEntity.id,
        },
        {
          ...postEntity2.toJSON(),
          onwerId: userEntity.id,
        },
      ]);

      // Act
      const foundPosts = await postDrizzleRepository.findAll();

      // Assert
      expect(foundPosts).toHaveLength(2);
      expect(foundPosts.map((post) => post.id)).toContain(postEntity1.id);
      expect(foundPosts.map((post) => post.id)).toContain(postEntity2.id);
    });

    it('should return empty array when no posts exist', async () => {
      // Act
      const foundPosts = await postDrizzleRepository.findAll();

      // Assert
      expect(foundPosts).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should delete a post by id', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      // Act
      await postDrizzleRepository.delete(postEntity.id);

      // Assert
      const results = await drizzleTestDB.db.query.post.findMany();
      expect(results).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      // Update the post entity
      const updatedTitle = 'Updated Title';
      const updatedContent = 'Updated Content';
      postEntity.update({ title: updatedTitle, content: updatedContent });

      // Act
      await postDrizzleRepository.update(postEntity);

      // Assert
      const updatedPost = await drizzleTestDB.db.query.post.findFirst({
        where: eq(postSchema.id, postEntity.id),
      });

      expect(updatedPost).toBeDefined();
      expect(updatedPost?.title).toBe(updatedTitle);
      expect(updatedPost?.content).toBe(updatedContent);
    });

    it('should save user likes when updating a post with userRepository defined', async () => {
      // Arrange
      const mockUserRepository = {} as UserRepository.Repository;
      (
        postDrizzleRepository as unknown as {
          userRepository: UserRepository.Repository;
        }
      ).userRepository = mockUserRepository;

      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      // Create a like entity that will be added
      const likeEntity = userEntity.togglePostLike(postEntity);
      expect(likeEntity).toBeDefined();
      if (!likeEntity) return;
      // Add to user's likes
      vi.spyOn(
        userEntity.$watchedRelations.likes,
        'getNewItems',
      ).mockReturnValue([likeEntity]);

      // Update the post entity
      postEntity.update({ title: 'Updated With Likes' });

      // Act
      await postDrizzleRepository.update(postEntity);

      // Assert
      const updatedPost = await drizzleTestDB.db.query.post.findFirst({
        where: eq(postSchema.id, postEntity.id),
      });

      expect(updatedPost).toBeDefined();
      expect(updatedPost?.title).toBe('Updated With Likes');

      // Check that the like was inserted into the database
      const likeResults = await drizzleTestDB.db.query.like.findMany({
        where: eq(likeSchema.userId, userEntity.id),
      });

      expect(likeResults).toHaveLength(1);
      expect(likeResults[0].postId).toBe(postEntity.id);
      expect(likeResults[0].userId).toBe(userEntity.id);
    });
  });

  describe('saveUser', () => {
    it('should throw error when userRepository is not defined', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();

      // Act & Assert
      await expect(
        postDrizzleRepository.updateUserRef(userEntity),
      ).rejects.toThrowError('User repository is not defined');
    });

    it('should save user likes', async () => {
      // Arrange - Create a mock UserRepository
      const mockUserRepository = {} as UserRepository.Repository;
      (
        postDrizzleRepository as unknown as {
          userRepository: UserRepository.Repository;
        }
      ).userRepository = mockUserRepository;

      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      // Insert the post
      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      // Create a like entity that will be added
      const likeEntity = LikeEntity.create(userEntity, postEntity);
      // Add to user's likes
      vi.spyOn(
        userEntity.$watchedRelations.likes,
        'getNewItems',
      ).mockReturnValue([likeEntity]);

      // Act
      await postDrizzleRepository.updateUserRef(userEntity);

      // Assert - Check that the like was inserted into the database
      const results = await drizzleTestDB.db.query.like.findMany({
        where: eq(likeSchema.userId, userEntity.id),
      });

      expect(results).toHaveLength(1);
      expect(results[0].postId).toBe(postEntity.id);
      expect(results[0].userId).toBe(userEntity.id);
    });

    it('should remove user likes', async () => {
      // Arrange - Create a mock UserRepository
      const mockUserRepository = {} as UserRepository.Repository;
      (
        postDrizzleRepository as unknown as {
          userRepository: UserRepository.Repository;
        }
      ).userRepository = mockUserRepository;

      const userEntity = UserPostEntityRefFactory();
      const postEntity = PostEntityMockFactory(
        { ownerId: userEntity.id },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      // Insert the post
      await drizzleTestDB.db.insert(postSchema).values({
        ...postEntity.toJSON(),
        onwerId: userEntity.id,
      });

      // Insert an existing like
      const like = LikeEntity.create(userEntity, postEntity);

      await drizzleTestDB.db.execute(
        drizzleTestDB.db.insert(likeSchema).values({
          ...like.toJSON(),
        }),
      );

      const likesSpy = vi.spyOn(
        userEntity.$watchedRelations.likes,
        'getRemovedItems',
      );

      likesSpy.mockReturnValue([like]);

      // Act
      await postDrizzleRepository.updateUserRef(userEntity);

      // Assert - Check that the like was removed from the database
      const results = await drizzleTestDB.db.query.like.findMany({
        where: eq(likeSchema.userId, userEntity.id),
      });

      expect(results).toHaveLength(0);
    });
  });

  describe('search', () => {
    it('should search posts with filters', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity1 = PostEntityMockFactory(
        {
          title: 'Test Post',
          ownerId: userEntity.id,
        },
        { owner: userEntity },
      );
      const postEntity2 = PostEntityMockFactory(
        {
          title: 'Another Post',
          ownerId: userEntity.id,
        },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values([
        {
          ...postEntity1.toJSON(),
          onwerId: userEntity.id,
        },
        {
          ...postEntity2.toJSON(),
          onwerId: userEntity.id,
        },
      ]);

      // Act
      const searchResult = await postDrizzleRepository.search(
        new PostRepository.SearchParams({
          filter: 'Test',
          page: 1,
          perPage: 10,
        }),
      );

      // Assert
      expect(searchResult.items).toHaveLength(1);
      expect(searchResult.items[0].id).toBe(postEntity1.id);
      expect(searchResult.items[0].title).toBe('Test Post');
    });

    it('should return all posts when no filter is provided', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity1 = PostEntityMockFactory(
        {
          title: 'Test Post',
          ownerId: userEntity.id,
        },
        { owner: userEntity },
      );
      const postEntity2 = PostEntityMockFactory(
        {
          title: 'Another Post',
          ownerId: userEntity.id,
        },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values([
        {
          ...postEntity1.toJSON(),
          onwerId: userEntity.id,
        },
        {
          ...postEntity2.toJSON(),
          onwerId: userEntity.id,
        },
      ]);

      // Act
      const searchResult = await postDrizzleRepository.search(
        new PostRepository.SearchParams({
          page: 1,
          perPage: 10,
        }),
      );

      // Assert
      expect(searchResult.items).toHaveLength(2);
    });

    it('should sort posts correctly', async () => {
      // Arrange
      const userEntity = UserPostEntityRefFactory();
      const postEntity1 = PostEntityMockFactory(
        {
          title: 'A Test Post',
          ownerId: userEntity.id,
        },
        { owner: userEntity },
      );
      const postEntity2 = PostEntityMockFactory(
        {
          title: 'B Test Post',
          ownerId: userEntity.id,
        },
        { owner: userEntity },
      );

      // Insert the user first
      await drizzleTestDB.db.insert(userSchema).values({
        ...userEntity.toJSON(),
      });

      await drizzleTestDB.db.insert(postSchema).values([
        {
          ...postEntity1.toJSON(),
          onwerId: userEntity.id,
        },
        {
          ...postEntity2.toJSON(),
          onwerId: userEntity.id,
        },
      ]);

      // Act - Sort by title in descending order
      const searchResult = await postDrizzleRepository.search(
        new PostRepository.SearchParams({
          page: 1,
          perPage: 10,
          sort: 'title',
          sortDir: 'desc',
        }),
      );

      // Assert
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items[0].title).toBe('B Test Post');
      expect(searchResult.items[1].title).toBe('A Test Post');
    });
  });
});
