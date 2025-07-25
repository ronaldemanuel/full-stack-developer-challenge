import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { PostEntity } from '@nx-ddd/post-domain';
import type { PaginationOutput } from '@nx-ddd/shared-domain';
import { PostRepository } from '@nx-ddd/post-domain';
import { PaginationOutputMapper } from '@nx-ddd/shared-application';

import type { SearchPostsInput } from '../schemas/queries.js';
import { searchPostsInputSchema } from '../schemas/queries.js';

export namespace SearchPostsQuery {
  export type Input = SearchPostsInput;
  export type Output = PaginationOutput<PostEntity>;

  class SearchPostsQuery extends Validated(searchPostsInputSchema) {}

  export function create(data: Input) {
    return new SearchPostsQuery(data);
  }

  @QueryHandler(SearchPostsQuery)
  export class Handler implements IQueryHandler<SearchPostsQuery, Output> {
    constructor(
      @Inject(PostRepository.TOKEN)
      private readonly postRepository: PostRepository.Repository,
    ) {}

    async execute(query: SearchPostsQuery): Promise<Output> {
      const searchParams = new PostRepository.SearchParams(query);
      const searchResult = await this.postRepository.search(searchParams);
      const paginationOutput = PaginationOutputMapper.toOutput(
        searchResult.items,
        searchResult,
      );
      return paginationOutput;
    }
  }
}
