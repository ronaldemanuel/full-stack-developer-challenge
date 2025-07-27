import type { ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InventoryRepository } from 'node_modules/@nx-ddd/post-domain/src/lib/repositories/index.js';
import { Validated } from 'validated-extendable';

import type { UseItemInput } from '../schemas/commands.js';
import { useItemInputSchema } from '../schemas/commands.js';

export namespace UseItemCommand {
  export type Input = UseItemInput;
  export type Output = void;

  class UseItemCommand extends Validated(useItemInputSchema) {}

  export function create(data: Input) {
    return new UseItemCommand(data);
  }

  @CommandHandler(UseItemCommand)
  export class Handler implements ICommandHandler<UseItemCommand, Output> {
    constructor(
      @Inject(InventoryRepository.TOKEN)
      private readonly inventoryRepository: InventoryRepository.Repository,
    ) {}

    async execute(command: UseItemCommand): Promise<Output> {
      const { userId, itemId } = command;

      const inventories = await this.inventoryRepository.findByUserId(userId);

      const inventory = inventories.find(
        (inv) => inv.item.id === itemId, // já que só tem um item
      );

      if (!inventory) throw new Error('Item não encontrado no inventário');

      const item = inventory.item; // diretamente

      item.use();

      await this.inventoryRepository.update([inventory]); // ainda passa como array

      item.commit?.();
    }
  }
}
