import type { IRepository } from '@nx-ddd/shared-domain';
import type { UserRepository } from '@nx-ddd/user-domain';
import { getRepositoryToken } from '@nx-ddd/shared-domain';

import type { ItemEntity } from '../entities/abstract-item.entity.js';

export namespace ItemRepository {
  export const TOKEN = getRepositoryToken('Item');

  export interface Repository extends IRepository<ItemEntity> {
    userRepository?: UserRepository.Repository;

    findById(id: string): Promise<ItemEntity>;
    findByUserId(userId: string): Promise<ItemEntity[]>;
  }
}
