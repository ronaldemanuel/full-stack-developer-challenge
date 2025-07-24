import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';
import { Cacheable } from '@nx-ddd/shared-application';

import { SearchPostsQuery } from '../queries/index.js';

export namespace SearchPostsUseCase {
  export type Input = SearchPostsQuery.Input;
  export type Output = SearchPostsQuery.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(QueryBus)
      private readonly queryBus: QueryBus,
    ) {}

    @Cacheable({
      key: (input: Input) =>
        `posts:search:${input.filter}:${input.page}:${input.perPage}:${input.sort}:${input.sortDir}`,
      namespace: 'posts',
      ttl: 60 * 60, // 1 hour
    })
    execute(input: Input): Output | Promise<Output> {
      return this.queryBus.execute<
        SearchPostsQuery.Input,
        SearchPostsQuery.Output
      >(SearchPostsQuery.create(input));
    }
  }
}
