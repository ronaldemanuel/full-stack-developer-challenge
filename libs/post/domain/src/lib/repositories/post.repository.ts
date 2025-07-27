import type { ISearchableRepository } from '@nx-ddd/shared-domain';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResults,
  getRepositoryToken,
} from '@nx-ddd/shared-domain';

import type { PostLikedAggregate } from '../aggregates/post-liked.aggregate';
import type { UserEntityPostRef } from '../entities/index';
import type { PostEntity } from '../entities/post.entity';
import type { UserRepositoryPostRef } from './refs/user-repository-post.ref';

export namespace PostRepository {
  export const TOKEN = getRepositoryToken('Post');

  export type Filter = string;
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResults<PostEntity> {}

  export interface Repository
    extends ISearchableRepository<
      PostEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    userRepository?: UserRepositoryPostRef.Repository;
    saveUser(user: UserEntityPostRef): Promise<void>;
    findById(id: string): Promise<PostEntity>;
    findById(
      id: string,
      scopes: {
        likedByUserId: string;
      },
    ): Promise<PostLikedAggregate>;
  }
}
