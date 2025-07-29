import type { InventoryItemEntity } from 'src/lib/entities/inventory-item.entity';

import { getRepositoryToken } from '@nx-ddd/shared-domain';

import type { ItemRepository } from './item.repository';

export namespace InventoryRepository {
  export const TOKEN = getRepositoryToken('InventoryItem');

  export interface Repository {
    itemRepository?: ItemRepository.Repository;

    findByUserId(userId: string): Promise<InventoryItemEntity[]>;
    findByUserIdAndItemId(
      userId: string,
      itemId: string,
    ): Promise<InventoryItemEntity>;
    update(inventoryItems: InventoryItemEntity[]): Promise<void>;

    findOrCreateByUserId(userId: string): Promise<InventoryItemEntity>;
  }
}
