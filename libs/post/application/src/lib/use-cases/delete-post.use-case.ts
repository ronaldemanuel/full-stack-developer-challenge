import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';
import { Transactional } from '@nx-ddd/database-application';
import { CacheEvict } from '@nx-ddd/shared-application';

import { DeletePostCommand } from '../commands/index';

export namespace DeletePostUseCase {
  export type Input = DeletePostCommand.Input;
  export type Output = DeletePostCommand.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(CommandBus)
      private readonly commandBus: CommandBus,
    ) {}

    @CacheEvict({
      key: 'posts',
    })
    @CacheEvict({
      key: (input: Input) => `posts::${input.id}`,
    })
    @Transactional()
    execute(input: Input): Output | Promise<Output> {
      return this.commandBus.execute<
        DeletePostCommand.Input,
        DeletePostCommand.Output
      >(DeletePostCommand.create(input));
    }
  }
}
