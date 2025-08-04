import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';

import { GetUserInventoryQuery } from '../queries/get-user-inventory.query';

export namespace ListUserInventoryUseCase {
  export type Input = Omit<GetUserInventoryQuery.Input, 'userId'>;
  export type Output = GetUserInventoryQuery.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(QueryBus)
      private readonly queryBus: QueryBus,
    ) {}

    execute(input: GetUserInventoryQuery.Input): Promise<Output> {
      return this.queryBus.execute<
        GetUserInventoryQuery.Input,
        GetUserInventoryQuery.Output
      >(GetUserInventoryQuery.create(input));
    }
  }
}
