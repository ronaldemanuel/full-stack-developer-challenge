import type { Entity, IRepository } from '@nx-ddd/shared-domain';
import { getRepositoryToken } from '@nx-ddd/shared-domain';

import type { UserEntity } from '../entities/user.entity.js';

export namespace UserRepository {
  export const TOKEN = getRepositoryToken('User');

  export interface Repository extends IRepository<UserEntity> {
    postRepository?: IRepository<Entity>;
  }
}
