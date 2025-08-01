import type { ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import { Transactional } from '@nx-ddd/database-application';
import {
  InventoryRepository,
  ItemRepository,
  UserItemRef,
} from '@nx-ddd/item-domain';
import { UserRepository } from '@nx-ddd/user-domain';

import type { AddItemToInventoryInput } from '../schemas/commands';
import { addItemToInventoryInputSchema } from '../schemas/commands';

export namespace AddItemToInventoryCommand {
  export type Input = AddItemToInventoryInput;
  export type Output = void;

  class AddItemToInventoryCommand extends Validated(
    addItemToInventoryInputSchema,
  ) {
    user: UserItemRef;

    constructor(input: Input, user: UserItemRef) {
      super(input);
      this.user = user;
    }
  }

  export function create(input: Input, user: UserItemRef) {
    return new AddItemToInventoryCommand(input, user);
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
      @Inject(InventoryRepository.TOKEN)
      private inventoryRepository: InventoryRepository.Repository,
    ) {}

    @Transactional()
    async execute(command: AddItemToInventoryCommand): Promise<Output> {
      const user = this.eventPublisher.mergeObjectContext(
        UserItemRef.cast(await this.userRepository.findById(command.user.id)),
      );

      const item = this.eventPublisher.mergeObjectContext(
        await this.itemRepository.findById(command.itemId),
      );

      user.addItemToInventory(item);

      await this.inventoryRepository.syncByUser(user);

      item.commit();
    }
  }
}
