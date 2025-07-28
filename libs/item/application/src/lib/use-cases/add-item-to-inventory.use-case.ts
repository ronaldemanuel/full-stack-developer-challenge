import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';

import { AddItemToInventoryCommand } from '../commands/add-item-to-inventory.command.js';

export namespace AddItemToInventoryUseCase {
  export type Input = AddItemToInventoryCommand.Input;
  export type Output = AddItemToInventoryCommand.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(CommandBus)
      private readonly commandBus: CommandBus,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.commandBus.execute<
        AddItemToInventoryCommand.Input,
        AddItemToInventoryCommand.Output
      >(
        AddItemToInventoryCommand.create({
          itemId: input.itemId,
          userId: input.userId,
        }),
      );
    }
  }
}
