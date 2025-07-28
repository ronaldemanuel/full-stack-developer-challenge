import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { ItemEntity } from '@nx-ddd/post-domain';
import { ItemRepository } from '@nx-ddd/post-domain';

import type { GetUserInventoryInput } from '../schemas/queries.js';
import { getUserInventoryInputSchema } from '../schemas/queries.js';

export namespace GetUserInventoryQuery {
  export type Input = GetUserInventoryInput;
  export type Output = ItemEntity[];

  class GetUserInventoryQuery extends Validated(getUserInventoryInputSchema) {}

  export function create(input: Input) {
    return new GetUserInventoryQuery(input);
  }

  @QueryHandler(GetUserInventoryQuery)
  export class Handler implements IQueryHandler<GetUserInventoryQuery, Output> {
    constructor(
      @Inject(ItemRepository.TOKEN)
      private readonly itemRepository: ItemRepository.Repository,
    ) {}

    async execute(query: GetUserInventoryQuery): Promise<Output> {
      return await this.itemRepository.findByUserId(query.userId);
    }
  }
}
