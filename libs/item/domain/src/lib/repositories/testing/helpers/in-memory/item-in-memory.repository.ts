import type { ItemEntity } from 'src/lib/entities/abstract-item.entity';

import type { UserRepository } from '@nx-ddd/user-domain';
import { InMemoryRepository } from '@nx-ddd/shared-domain';

import type { ItemRepository } from '../../../item.repository';

export class ItemInMemoryRepository
  extends InMemoryRepository<ItemEntity>
  implements ItemRepository.Repository
{
  userRepository?: UserRepository.Repository | undefined;

  findByUserId(userId: string): Promise<ItemEntity[]> {
    const items = this.items.filter((item) => item.character?.id === userId);
    return Promise.resolve(items);
  }
}
