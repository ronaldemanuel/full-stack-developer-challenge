/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PostEntityMockFactory,
  PostInMemoryRepository,
  PostLikedAggregate,
  PostRepository,
  UserPostEntityRefFactory,
} from '@nx-ddd/post-domain';

import { GetPostByIdQuery } from '../../get-post-by-id.query.js';

describe('GetPostByIdQuery', () => {
  let getPostByIdQuery: GetPostByIdQuery.Handler;
  let postRepository: PostRepository.Repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [
        GetPostByIdQuery.Handler,
        {
          provide: PostRepository.TOKEN,
          useClass: PostInMemoryRepository,
        },
      ],
    }).compile();

    getPostByIdQuery = moduleRef.get<GetPostByIdQuery.Handler>(
      GetPostByIdQuery.Handler,
    );
    postRepository = moduleRef.get<PostRepository.Repository>(
      PostRepository.TOKEN,
    );
  });

  it('should be defined', () => {
    expect(getPostByIdQuery).toBeDefined();
  });

  it('should get post by ID without user context', async () => {
    // Arrange
    const mockPost = PostEntityMockFactory();

    // Set up spy on the toJSON method
    const toJSONSpy = vi.spyOn(mockPost, 'toJSON');

    // Use type assertion for the mock implementation

    vi.spyOn(postRepository, 'findById').mockReturnValue(
      Promise.resolve(mockPost as any),
    );

    const query = GetPostByIdQuery.create({
      id: mockPost.id,
    });

    // Act
    const result = await getPostByIdQuery.execute(query);

    // Assert
    expect(postRepository.findById).toHaveBeenCalledWith(mockPost.id);
    expect(toJSONSpy).toHaveBeenCalled();
    expect(result).toEqual(mockPost.toJSON());
  });

  it('should get post by ID with user context', async () => {
    // Arrange
    const mockPost = PostEntityMockFactory();
    const mockUser = UserPostEntityRefFactory();

    // Create PostLikedAggregate
    const postAggregate = new PostLikedAggregate(mockPost, true);

    // Set up spy on the toJSON method
    const toJSONSpy = vi.spyOn(postAggregate, 'toJSON');

    // Use explicit mock implementation for the overloaded method
    vi.spyOn(postRepository, 'findById').mockReturnValue(
      Promise.resolve(postAggregate),
    );

    const query = GetPostByIdQuery.create(
      {
        id: mockPost.id,
      },
      mockUser,
    );

    // Act
    const result = await getPostByIdQuery.execute(query);

    // Assert
    expect(postRepository.findById).toHaveBeenCalledWith(mockPost.id, {
      likedByUserId: mockUser.id,
    });
    expect(toJSONSpy).toHaveBeenCalled();
    expect(result).toEqual({
      ...mockPost.toJSON(),
      meta: {
        liked: true,
      },
    });
  });
});
