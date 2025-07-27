import type { IntersectRepositories, IRepository } from '@nx-ddd/shared-domain';
import { UserRepository } from '@nx-ddd/user-domain';

import type { UserEntityPostRef } from '../../entities/refs/user-entity-post.ref';
import type { PostRepository } from '../post.repository';

export namespace UserRepositoryPostRef {
  export const TOKEN = UserRepository.TOKEN;
  export interface Repository
    extends IntersectRepositories<
      IRepository<UserEntityPostRef>,
      UserRepository.Repository
    > {
    postRepository?: PostRepository.Repository;
  }
}
