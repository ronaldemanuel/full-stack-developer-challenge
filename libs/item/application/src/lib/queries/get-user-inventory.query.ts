import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';

import type { ItemEntity, UserItemRef } from '@nx-ddd/post-domain';
import { ItemRepository } from '@nx-ddd/post-domain';

export namespace GetUserInventoryQuery {
  export type Input = UserItemRef;
  export type Output = ItemEntity[];

  class GetUserInventoryQuery {
    user: UserItemRef;

    constructor(user: UserItemRef) {
      this.user = user;
    }
  }

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
      return await this.itemRepository.findByUserId(query.user.id);
    }
  }
}
