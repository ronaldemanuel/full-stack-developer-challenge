import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';

import { GetAllItemsQuery } from '../queries/get-all-items.query';

export namespace ListAllItemsUseCase {
  export type Input = GetAllItemsQuery.Input;
  export type Output = GetAllItemsQuery.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(QueryBus)
      private readonly queryBus: QueryBus,
    ) {}

    execute(input: Input): Promise<Output> {
      return this.queryBus.execute<
        GetAllItemsQuery.Input,
        GetAllItemsQuery.Output
      >(GetAllItemsQuery.create(input));
    }
  }
}
