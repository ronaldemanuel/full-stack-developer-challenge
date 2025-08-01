import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { ItemEntity } from '@nx-ddd/item-domain';
import { ItemRepository } from '@nx-ddd/item-domain';

import { getAllItemsInputSchema } from '../schemas/queries';

export namespace GetAllItemsQuery {
  export type Input = object;
  export type Output = ItemEntity[];

  class GetAllItemsQuery extends Validated(getAllItemsInputSchema) {}

  export function create(input: Input) {
    return new GetAllItemsQuery(input);
  }

  @QueryHandler(GetAllItemsQuery)
  export class Handler implements IQueryHandler<GetAllItemsQuery, Output> {
    constructor(
      @Inject(ItemRepository.TOKEN)
      private readonly itemRepository: ItemRepository.Repository,
    ) {}

    async execute(query: GetAllItemsQuery): Promise<Output> {
      return await this.itemRepository.findAll();
    }
  }
}
