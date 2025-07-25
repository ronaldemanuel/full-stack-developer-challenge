import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { UserEntityPostRef } from '@nx-ddd/post-domain';
import type { IUseCase } from '@nx-ddd/shared-application';
import { Transactional } from '@nx-ddd/database-application';
import { CacheEvict } from '@nx-ddd/shared-application';

import { CreatePostCommand } from '../commands/index.js';

export namespace CreatePostUseCase {
  export type Input = CreatePostCommand.Input & {
    user: UserEntityPostRef;
  };
  export type Output = CreatePostCommand.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(CommandBus)
      private readonly commandBus: CommandBus,
    ) {}

    @CacheEvict({
      key: 'posts',
    })
    @Transactional()
    execute(input: Input): Output | Promise<Output> {
      return this.commandBus.execute<
        CreatePostCommand.Input,
        CreatePostCommand.Output
      >(
        CreatePostCommand.create(
          {
            title: input.title,
            content: input.content,
          },
          input.user,
        ),
      );
    }
  }
}
