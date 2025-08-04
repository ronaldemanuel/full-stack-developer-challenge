/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PostInMemoryRepository,
  PostRepository,
  UserPostEntityRefFactory,
} from '@nx-ddd/post-domain';
import { UserInMemoryRepository, UserRepository } from '@nx-ddd/user-domain';

import { CreatePostCommand } from '../../create-post.command';

describe('CreatePostCommand', () => {
  let createPostCommand: CreatePostCommand.Handler;
  let postRepository: PostRepository.Repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [
        CreatePostCommand.Handler,
        {
          provide: PostRepository.TOKEN,
          useClass: PostInMemoryRepository,
        },
        {
          provide: UserRepository.TOKEN,
          useClass: UserInMemoryRepository,
        },
      ],
    }).compile();

    createPostCommand = moduleRef.get<CreatePostCommand.Handler>(
      CreatePostCommand.Handler,
    );
    postRepository = moduleRef.get<PostRepository.Repository>(
      PostRepository.TOKEN,
    );
  });

  it('should be defined', () => {
    expect(createPostCommand).toBeDefined();
  });

  it('should create a post and save it to the repository', async () => {
    // Arrange
    const mockUser = UserPostEntityRefFactory();
    vi.spyOn(postRepository, 'insert').mockResolvedValue(undefined);

    const command = CreatePostCommand.create(
      {
        title: 'Test Post',
        content: 'This is a test post content',
      },
      mockUser,
    );

    // Act
    await createPostCommand.execute(command);

    // Assert
    expect(postRepository.insert).toHaveBeenCalledTimes(1);
    expect(postRepository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          title: 'Test Post',
          content: 'This is a test post content',
          ownerId: mockUser.id,
        }),
      }),
    );
  });
});
