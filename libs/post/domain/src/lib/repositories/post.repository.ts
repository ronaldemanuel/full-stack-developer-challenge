import type { ISearchableRepository } from '@nx-ddd/shared-domain';
import type { UserRepository } from '@nx-ddd/user-domain';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResults,
  getRepositoryToken,
} from '@nx-ddd/shared-domain';

import type { PostLikedAggregate } from '../aggregates/post-liked.aggregate';
import type { UserEntityPostRef } from '../entities/index';
import type { PostEntity } from '../entities/post.entity';

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
    userRepository?: UserRepository.Repository;
    updateUserRef(user: UserEntityPostRef): Promise<void>;
    findById(id: string): Promise<PostEntity>;
    findById(
      id: string,
      scopes: {
        likedByUserId: string;
      },
    ): Promise<PostLikedAggregate>;
  }
}
