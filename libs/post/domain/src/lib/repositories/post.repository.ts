import type { ISearchableRepository } from '@nx-ddd/shared-domain';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResults,
  getRepositoryToken,
} from '@nx-ddd/shared-domain';

import type { PostEntity } from '../entities/post.entity.js';

export namespace PostRepository {
  export const TOKEN = getRepositoryToken('Post');

  export type Filter = string;
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResults<PostEntity> {}

  export type Repository = ISearchableRepository<
    PostEntity,
    Filter,
    SearchParams,
    SearchResult
  >;
}
