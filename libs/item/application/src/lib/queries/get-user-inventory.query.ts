import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { ItemEntity } from '@nx-ddd/post-domain';
import type { User } from '@nx-ddd/user-domain';
import { InventoryRepository, ItemRepository } from '@nx-ddd/post-domain';
import { userSchema } from '@nx-ddd/user-domain';

export namespace GetUserInventoryQuery {
  export type Input = User;
  export type Output = ItemEntity[];

  class GetUserInventoryQuery extends Validated(userSchema) {}

  export function create(input: Input) {
    return new GetUserInventoryQuery(input);
  }

  @QueryHandler(GetUserInventoryQuery)
  export class Handler implements IQueryHandler<GetUserInventoryQuery, Output> {
    constructor(
      @Inject(InventoryRepository.TOKEN)
      private readonly inventoryRepository: InventoryRepository.Repository,
    ) {}

    async execute(query: GetUserInventoryQuery): Promise<Output> {
      const inventory = this.inventoryRepository.findByUserId(query.id);

      const items = (await inventory).map(
        (inventoryItem) => inventoryItem.item,
      );

      return items;
    }
  }
}
