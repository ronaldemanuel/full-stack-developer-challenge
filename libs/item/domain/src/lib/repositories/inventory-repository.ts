import type { InventoryItemEntity } from 'src/lib/entities/inventory-item.entity';

import type { UserRepository } from '@nx-ddd/user-domain';
import { getRepositoryToken } from '@nx-ddd/shared-domain';

export namespace InventoryRepository {
  export const TOKEN = getRepositoryToken('Inventory');

  export interface Repository {
    userRepository?: UserRepository.Repository;

    findByUserId(userId: string): Promise<InventoryItemEntity[]>;
    findByUserIdAndItemId(
      userId: string,
      itemId: string,
    ): Promise<InventoryItemEntity>;

    update(
      userId: string,
      inventoryItems: InventoryItemEntity[],
    ): Promise<void>;

    findOrCreateByUserId(userId: string): Promise<InventoryItemEntity>;
  }
}
