import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { UserEntityPostRef } from '@nx-ddd/post-domain';
import type { IUseCase } from '@nx-ddd/shared-application';
import { Transactional } from '@nx-ddd/database-application';
import { CacheEvict } from '@nx-ddd/shared-application';

import { ToggleLikeCommand } from '../commands/toggle-like.command';

export namespace ToggleLikeUseCase {
  export type Input = Omit<ToggleLikeCommand.Input, 'userId'> & {
    user: UserEntityPostRef;
  };
  export type Output = ToggleLikeCommand.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(CommandBus)
      private readonly commandBus: CommandBus,
    ) {}

    @CacheEvict({
      key: 'posts',
    })
    @CacheEvict({
      key: (input: Input) => `posts::${input.postId}`,
    })
    @Transactional()
    execute(input: Input): Output | Promise<Output> {
      return this.commandBus.execute<
        ToggleLikeCommand.Input,
        ToggleLikeCommand.Output
      >(
        ToggleLikeCommand.create({
          postId: input.postId,
          userId: input.user.id,
        }),
      );
    }
  }
}
