import { Injectable } from '@nestjs/common';

import type { ItemEntity, ItemRepository } from '@nx-ddd/item-domain';
import { ItemMapper, ITEMS } from '@nx-ddd/item-domain';
import { InMemoryRepository } from '@nx-ddd/shared-domain';

@Injectable()
export class InMemoryItemRepository
  extends InMemoryRepository<ItemEntity>
  implements ItemRepository.Repository
{
  constructor() {
    super();
    this.items = Object.values(ITEMS).map((el) => ItemMapper.toDomain(el));
  }
  findIdListByType(type: string): Promise<string[]> {
    const idList = this.items
      .filter((item) => item.type === type)
      .map((item) => item.id);
    return Promise.resolve(idList);
  }
}
