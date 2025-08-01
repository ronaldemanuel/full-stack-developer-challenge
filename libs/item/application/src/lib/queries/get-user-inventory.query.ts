import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { InventoryItemEntity, ItemEntity } from '@nx-ddd/item-domain';
import type { User } from '@nx-ddd/user-domain';
import { InventoryRepository } from '@nx-ddd/item-domain';
import { userSchema } from '@nx-ddd/user-domain';

export namespace GetUserInventoryQuery {
  export type Input = User;
  export type Output = InventoryItemEntity[];

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
      return await this.inventoryRepository.findByUserId(query.id);
    }
  }
}
