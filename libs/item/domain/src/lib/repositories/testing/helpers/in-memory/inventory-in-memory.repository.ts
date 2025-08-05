import type { UserRepository } from '@nx-ddd/user-domain';
import { InMemoryRepository } from '@nx-ddd/shared-domain';

import type { InventoryItemEntity } from '../../../../entities';
import type { UserItemRef } from '../../../../refs';
import type { InventoryRepository } from '../../../../repositories/inventory-repository';

export class InventoryInMemoryRepository
  extends InMemoryRepository<InventoryItemEntity>
  implements InventoryRepository.Repository
{
  insertCoins(userId: string, amount: number): Promise<void> {
    return Promise.resolve();
  }

  findByUserIdAndType(
    userId: string,
    type: string,
  ): Promise<InventoryItemEntity[]> {
    const items = this.items.filter(
      (i) => i.item.type === type && i.characterId === userId,
    );

    return Promise.resolve(items);
  }

  findByUserIdAndItemId(
    userId: string,
    itemId: string,
  ): Promise<InventoryItemEntity> {
    const item = this.items.find(
      (item) => item.characterId === userId && item.itemId === itemId,
    );

    if (!item) {
      throw new Error(`Item ${itemId} not found for user ${userId}`);
    }

    return Promise.resolve(item);
  }
  syncByUser(user: UserItemRef): Promise<void> {
    throw new Error('Method not implemented.');
  }
  userRepository?: UserRepository.Repository | undefined;

  findByUserId(userId: string): Promise<InventoryItemEntity[]> {
    const items = this.items.filter((item) => item.characterId === userId);

    return Promise.resolve(items);
  }
}
