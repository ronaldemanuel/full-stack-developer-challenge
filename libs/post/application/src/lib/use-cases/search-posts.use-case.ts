import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';
import { Cacheable } from '@nx-ddd/shared-application';

import { SearchPostsQuery } from '../queries/index';

export namespace SearchPostsUseCase {
  export type Input = SearchPostsQuery.Input;
  export type Output = SearchPostsQuery.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(QueryBus)
      private readonly queryBus: QueryBus,
    ) {}

    @Cacheable({
      key: (input: Input) => {
        if (
          !input.filter ||
          !input.page ||
          !input.perPage ||
          !input.sort ||
          !input.sortDir
        ) {
          return 'posts';
        }
        if (input.page) {
          return `posts::search::${input.page}`;
        }
        return '';
      },
      ttl: 1000 * 60 * 10, // 1 minute
    })
    execute(input: Input): Output | Promise<Output> {
      return this.queryBus.execute<
        SearchPostsQuery.Input,
        SearchPostsQuery.Output
      >(SearchPostsQuery.create(input));
    }
  }
}
