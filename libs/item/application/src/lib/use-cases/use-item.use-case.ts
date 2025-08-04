import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { UserItemRef } from '@nx-ddd/item-domain';
import type { IUseCase } from '@nx-ddd/shared-application';
import { Transactional } from '@nx-ddd/database-application';

import { UseItemCommand } from '../commands/use-item.command';

export namespace UseItemUseCase {
  export type Input = UseItemCommand.Input & { user: UserItemRef };
  export type Output = UseItemCommand.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(CommandBus)
      private readonly commandBus: CommandBus,
    ) {}

    @Transactional()
    async execute(input: Input): Promise<Output> {
      return this.commandBus.execute<
        UseItemCommand.Input,
        UseItemCommand.Output
      >(UseItemCommand.create({ itemId: input.itemId }, input.user));
    }
  }
}
