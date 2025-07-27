/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import type {
  TransactionalAdapter,
  TransactionalOptionsAdapterFactory,
} from '@nestjs-cls/transactional';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DATABASE_CONNECTION_NAME } from '@nx-ddd/database-application';
import {
  PostEntityMockFactory,
  PostInMemoryRepository,
  PostLikedAggregate,
  PostRepository,
  UserPostEntityRefFactory,
  UserPostRefInMemoryRepository,
  UserRepositoryPostRef,
} from '@nx-ddd/post-domain';

import { ToggleLikeCommand } from '../../toggle-like.command.js';

class StubAdapter implements TransactionalAdapter<any, any, any> {
  connectionToken?: any;
  connection?: any;
  defaultTxOptions?: Partial<any> | undefined;
  optionsFactory: TransactionalOptionsAdapterFactory<any, any, any> = () => {
    return {
      getFallbackInstance() {
        return {};
      },
      wrapWithTransaction(options, fn, setTx) {
        return fn();
      },
      wrapWithNestedTransaction(options, fn, setTx, tx) {
        return fn();
      },
    };
  };
}

describe('ToggleLikeCommand', () => {
  let toggleLikeCommand: ToggleLikeCommand.Handler;
  let postRepository: PostRepository.Repository;
  let userRepository: UserRepositoryPostRef.Repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClsModule.forRoot({
          plugins: [
            new ClsPluginTransactional({
              connectionName: DATABASE_CONNECTION_NAME,
              enableTransactionProxy: true,
              adapter: new StubAdapter(),
              imports: [],
            }),
          ],
        }),
        CqrsModule.forRoot(),
      ],
      controllers: [],
      providers: [
        ToggleLikeCommand.Handler,
        {
          provide: PostRepository.TOKEN,
          useClass: PostInMemoryRepository,
        },
        {
          provide: UserRepositoryPostRef.TOKEN,
          useClass: UserPostRefInMemoryRepository,
        },
      ],
    }).compile();

    toggleLikeCommand = moduleRef.get<ToggleLikeCommand.Handler>(
      ToggleLikeCommand.Handler,
    );
    postRepository = moduleRef.get<PostRepository.Repository>(
      PostRepository.TOKEN,
    );
    userRepository = moduleRef.get<UserRepositoryPostRef.Repository>(
      UserRepositoryPostRef.TOKEN,
    );
  });

  it('should be defined', () => {
    expect(toggleLikeCommand).toBeDefined();
  });

  it('should toggle like on a post', async () => {
    // Arrange
    const mockUser = UserPostEntityRefFactory(undefined);
    const mockPost = PostEntityMockFactory();

    // Create spies on the user methods
    const toggleLikeSpy = vi.spyOn(mockUser, 'toggleLike');
    vi.spyOn(mockUser, 'commit');

    // Mock repository methods
    vi.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

    // Use type assertion here since in the implementation context,
    // this specific method is overloaded and TS can't determine which overload is being used
    vi.spyOn(postRepository, 'findById').mockImplementation(async () => {
      return mockPost as any;
    });

    vi.spyOn(postRepository, 'saveUser').mockResolvedValue(undefined);

    const command = ToggleLikeCommand.create({
      userId: mockUser.id,
      postId: mockPost.id,
    });

    // Act
    await toggleLikeCommand.execute(command);

    // Assert
    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(postRepository.findById).toHaveBeenCalledWith(mockPost.id);
    expect(toggleLikeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockPost.id,
      }),
    );
    expect(postRepository.saveUser).toHaveBeenCalledWith(mockUser);
    expect(mockUser.commit).toHaveBeenCalled();
  });
});
