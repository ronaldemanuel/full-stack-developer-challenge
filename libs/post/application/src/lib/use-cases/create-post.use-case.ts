import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';
import { CacheEvict } from '@nx-ddd/shared-application';

import { CreatePostCommand } from '../commands/index.js';

export namespace CreatePostUseCase {
  export type Input = CreatePostCommand.Input;
  export type Output = CreatePostCommand.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(CommandBus)
      private readonly commandBus: CommandBus,
    ) {}

    @CacheEvict({
      key: 'posts',
    })
    execute(input: Input): Output | Promise<Output> {
      return this.commandBus.execute<
        CreatePostCommand.Input,
        CreatePostCommand.Output
      >(CreatePostCommand.create(input));
    }
  }
}
