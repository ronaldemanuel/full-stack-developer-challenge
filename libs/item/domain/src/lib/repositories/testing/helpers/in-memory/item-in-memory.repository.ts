import type { ItemEntity } from 'src/lib/entities/abstract-item.entity';

import type { UserRepository } from '@nx-ddd/user-domain';
import { InMemoryRepository } from '@nx-ddd/shared-domain';

import type { ItemRepository } from '../../../item.repository';

export class ItemInMemoryRepository
  extends InMemoryRepository<ItemEntity>
  implements ItemRepository.Repository
{
  findByType(type: string): Promise<ItemEntity[]> {
    throw new Error('Method not implemented.');
  }

  userRepository?: UserRepository.Repository | undefined;

  findByUserId(userId: string): Promise<ItemEntity[]> {
    const items = this.items.filter((item) => item.character?.id === userId);
    return Promise.resolve(items);
  }

  findIdListByType(type: string): Promise<string[]> {
    const idList = this.items
      .filter((item) => item.type === type)
      .map((item) => item.id);
    return Promise.resolve(idList);
  }
}
