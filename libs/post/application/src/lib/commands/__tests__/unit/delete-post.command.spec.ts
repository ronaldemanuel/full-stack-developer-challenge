/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PostEntityMockFactory,
  PostInMemoryRepository,
  PostRepository,
} from '@nx-ddd/post-domain';

import { DeletePostCommand } from '../../delete-post.command';

describe('DeletePostCommand', () => {
  let deletePostCommand: DeletePostCommand.Handler;
  let postRepository: PostRepository.Repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [
        DeletePostCommand.Handler,
        {
          provide: PostRepository.TOKEN,
          useClass: PostInMemoryRepository,
        },
      ],
    }).compile();

    deletePostCommand = moduleRef.get<DeletePostCommand.Handler>(
      DeletePostCommand.Handler,
    );
    postRepository = moduleRef.get<PostRepository.Repository>(
      PostRepository.TOKEN,
    );
  });

  it('should be defined', () => {
    expect(deletePostCommand).toBeDefined();
  });

  it('should delete a post from the repository', async () => {
    // Arrange
    const mockPost = PostEntityMockFactory();
    const mockPostId = mockPost.id;

    // Mock the delete method
    vi.spyOn(postRepository, 'delete').mockResolvedValue(undefined);

    const command = DeletePostCommand.create({
      id: mockPostId,
    });

    // Act
    await deletePostCommand.execute(command);

    // Assert
    expect(postRepository.delete).toHaveBeenCalledWith(mockPostId);
    expect(postRepository.delete).toHaveBeenCalledTimes(1);
  });
});
