import type { ItemEntity } from 'src/lib/entities/abstract-item.entity.js';

import type { UserRepository } from '@nx-ddd/user-domain';
import { InMemoryRepository } from '@nx-ddd/shared-domain';

import type { ItemRepository } from '../../../item.repository.js';

export class ItemInMemoryRepository
  extends InMemoryRepository<ItemEntity>
  implements ItemRepository.Repository
{
  userRepository?: UserRepository.Repository | undefined;
}
