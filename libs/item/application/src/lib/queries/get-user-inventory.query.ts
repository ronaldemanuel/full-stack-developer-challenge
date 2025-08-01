import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { InventoryItemEntity } from '@nx-ddd/item-domain';
import { InventoryRepository } from '@nx-ddd/item-domain';

import type { GetUserInventoryInput } from '../schemas';
import { getUserInventoryInputSchema } from '../schemas';

export namespace GetUserInventoryQuery {
  export type Input = GetUserInventoryInput;
  export type Output = InventoryItemEntity[];

  class GetUserInventoryQuery extends Validated(getUserInventoryInputSchema) {}

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
      return await this.inventoryRepository.findByUserIdAndTypePaginated(
        query.userId,
        query.type,
      );
    }
  }
}
