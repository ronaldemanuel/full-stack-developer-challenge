import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';

import { SearchPostsQuery } from '../queries/index.js';

export namespace SearchPostsUseCase {
  export type Input = SearchPostsQuery.Output;
  export type Output = SearchPostsQuery.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(QueryBus)
      private readonly queryBus: QueryBus,
    ) {}

    execute(input: Input): Output | Promise<Output> {
      return this.queryBus.execute<
        SearchPostsQuery.Input,
        SearchPostsQuery.Output
      >(SearchPostsQuery.create(input));
    }
  }
}
