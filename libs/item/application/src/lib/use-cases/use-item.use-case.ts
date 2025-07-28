import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';

import { UseItemCommand } from '../commands/use-item.command.js';

export namespace UseItemUseCase {
  export type Input = UseItemCommand.Input;
  export type Output = UseItemCommand.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(CommandBus)
      private readonly commandBus: CommandBus,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.commandBus.execute<
        UseItemCommand.Input,
        UseItemCommand.Output
      >(
        UseItemCommand.create({
          itemId: input.itemId,
          userId: input.userId,
        }),
      );
    }
  }
}
