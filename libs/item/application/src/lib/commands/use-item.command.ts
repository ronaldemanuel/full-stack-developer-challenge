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

import type { UseItemInput } from '../schemas/commands';
import { useItemInputSchema } from '../schemas/commands';

export namespace UseItemCommand {
  export type Input = UseItemInput;
  export type Output = void;

  class UseItemCommand extends Validated(useItemInputSchema) {
    user: UserItemRef;

    constructor(input: Input, user: UserItemRef) {
      super(input);
      this.user = user;
    }
  }

  export function create(input: Input, user: UserItemRef) {
    return new UseItemCommand(input, user);
  }

  @CommandHandler(UseItemCommand)
  export class Handler implements ICommandHandler<UseItemCommand, Output> {
    constructor(
      @Inject(ItemRepository.TOKEN)
      private readonly itemRepository: ItemRepository.Repository,
      @Inject(EventPublisher)
      private readonly eventPublisher: EventPublisher,
      @Inject(UserRepository.TOKEN)
      private userRepository: UserRepository.Repository,
      @Inject(InventoryRepository.TOKEN)
      private inventoryRepository: InventoryRepository.Repository,
    ) {}

    @Transactional()
    async execute(command: UseItemCommand): Promise<Output> {
      const inventory = await this.inventoryRepository.findByUserId(
        command.user.id,
      );

      const user = this.eventPublisher.mergeObjectContext(
        UserItemRef.cast(
          await this.userRepository.findById(command.user.id),
          () => ({ inventory }),
        ),
      );

      user.useItem(command.itemId);

      await this.inventoryRepository.syncByUser(user);

      user.commit();
    }
  }
}
