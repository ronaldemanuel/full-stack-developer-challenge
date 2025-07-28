import type { ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import { Transactional } from '@nx-ddd/database-application';
import { ItemRepository, UserItemRef } from '@nx-ddd/item-domain';
import { UserRepository } from '@nx-ddd/user-domain';

import type { AddItemToInventoryInput } from '../schemas/commands.js';
import { addItemToInventoryInputSchema } from '../schemas/commands.js';

export namespace AddItemToInventoryCommand {
  export type Input = AddItemToInventoryInput;
  export type Output = void;

  class AddItemToInventoryCommand extends Validated(
    addItemToInventoryInputSchema,
  ) {}

  export function create(input: Input) {
    return new AddItemToInventoryCommand(input);
  }

  @CommandHandler(AddItemToInventoryCommand)
  export class Handler
    implements ICommandHandler<AddItemToInventoryCommand, Output>
  {
    constructor(
      @Inject(EventPublisher)
      private readonly eventPublisher: EventPublisher,
      @Inject(ItemRepository.TOKEN)
      private readonly itemRepository: ItemRepository.Repository,
      @Inject(UserRepository.TOKEN)
      private userRepository: UserRepository.Repository,
    ) {}

    @Transactional()
    async execute(command: AddItemToInventoryCommand): Promise<Output> {
      const user = this.eventPublisher.mergeObjectContext(
        UserItemRef.cast(await this.userRepository.findById(command.userId)),
      );

      const item = this.eventPublisher.mergeObjectContext(
        await this.itemRepository.findById(command.itemId),
      );

      user.addItemToInventory(item);

      await this.itemRepository.update(item);

      item.commit();
    }
  }
}
