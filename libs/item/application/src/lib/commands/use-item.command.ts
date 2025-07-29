import type { ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import { Transactional } from '@nx-ddd/database-application';
import { ItemRepository, UserItemRef } from '@nx-ddd/post-domain';
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
    ) {
      itemRepository.userRepository = userRepository;
    }

    @Transactional()
    async execute(command: UseItemCommand): Promise<Output> {
      const user = this.eventPublisher.mergeObjectContext(
        UserItemRef.cast(await this.userRepository.findById(command.user.id)),
      );

      const item = this.eventPublisher.mergeObjectContext(
        await this.itemRepository.findById(command.itemId),
      );

      user.useItem(item.id);

      await this.itemRepository.update(item);

      item.commit();
    }
  }
}
