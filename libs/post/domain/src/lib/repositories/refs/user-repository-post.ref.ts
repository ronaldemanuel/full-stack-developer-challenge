import { UserRepository } from '@nx-ddd/user-domain';

import type { PostRepository } from '../post.repository.js';

export namespace UserRepositoryPostRef {
  export const TOKEN = UserRepository.TOKEN;

  export interface Repository extends UserRepository.Repository {
    postRepository?: PostRepository.Repository;
  }
}
