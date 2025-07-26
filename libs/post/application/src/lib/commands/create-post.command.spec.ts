/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import {
  PostInMemoryRepository,
  PostRepository,
  UserPostRefInMemoryRepository,
  UserRepositoryPostRef,
} from '@nx-ddd/post-domain';

import { CreatePostCommand } from './create-post.command.js'; // Adjust the import path as necessary

describe('CreatePostCommand', () => {
  let createPostCommand: CreatePostCommand.Handler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()], // Add
      controllers: [], // Add
      providers: [
        CreatePostCommand.Handler,
        {
          provide: PostRepository.TOKEN,
          useClass: PostInMemoryRepository,
        },
        {
          provide: UserRepositoryPostRef.TOKEN,
          useClass: UserPostRefInMemoryRepository,
        },
      ], // Add
    }).compile();

    createPostCommand = moduleRef.get<CreatePostCommand.Handler>(
      CreatePostCommand.Handler,
    );
  });

  it('should be defined', () => {
    expect(createPostCommand).toBeDefined();
  });
});
