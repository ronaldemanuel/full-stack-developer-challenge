import { Inject, Injectable } from '@nestjs/common';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type {
  InventoryItemEntity,
  InventoryItemEntityRelations,
  InventoryRepository,
} from '@nx-ddd/item-domain';
import {
  InjectDrizzle,
  InjectDrizzleTransaction,
} from '@nx-ddd/database-infrastructure';
import { and, eq } from '@nx-ddd/database-infrastructure/drizzle/operators';
import { userItem } from '@nx-ddd/database-infrastructure/drizzle/schema';
import { InventoryItemMapper, ItemRepository } from '@nx-ddd/item-domain';
import { NotFoundError } from '@nx-ddd/shared-domain';
import { UserRepository } from '@nx-ddd/user-domain';
import { UserDrizzleModelMapper } from '@nx-ddd/user-infrastructure';

import { UserItemRefDrizzleModelMapper } from '../model/user-item-ref-drizzle-model.mapper';

@Injectable()
export class InventoryDrizzleRepository
  implements InventoryRepository.Repository
{
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleDB,
    @InjectDrizzleTransaction()
    private readonly tx: DrizzleTX,
    @Inject(ItemRepository.TOKEN)
    private readonly itemRepository: ItemRepository.Repository,
    @Inject(UserRepository.TOKEN)
    public userRepository?: UserRepository.Repository,
  ) {}

  update(userId: string, inventoryItems: InventoryItemEntity[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findByUserIdAndItemId(
    userId: string,
    itemId: string,
  ): Promise<InventoryItemEntity> {
    const inventoryItem = await this.db.query.userItem.findFirst({
      where: and(eq(userItem.itemId, itemId), eq(userItem.userId, userId)),
      with: {
        user: this.userRepository ? true : undefined,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundError('Inventory not found.');
    }

    const item = await this.itemRepository.findById(inventoryItem.itemId);

    const relations: InventoryItemEntityRelations = {
      item,
    };

    if (this.userRepository && inventoryItem.user) {
      relations.character = UserDrizzleModelMapper.toEntity(inventoryItem.user);
    }

    return InventoryItemMapper.toDomain(
      {
        amount: inventoryItem.amount,
      },
      relations,
    );
  }

  findOrCreateByUserId(userId: string): Promise<InventoryItemEntity> {
    throw new Error('Method not implemented.');
  }

  async findByUserId(userId: string): Promise<InventoryItemEntity[]> {
    const items = await this.db.query.userItem.findMany({
      where: eq(userItem.userId, userId),
      with: {
        user: this.userRepository ? true : undefined,
      },
    });

    const entities = await Promise.all(
      items.map(async (item) => {
        const itemData = await this.itemRepository.findById(item.itemId);
        if (!itemData) throw new NotFoundError('Item no found');

        const inventoryItemRelations: InventoryItemEntityRelations = {
          item: itemData,
        };

        if (this.userRepository) {
          inventoryItemRelations.character = UserDrizzleModelMapper.toEntity(
            item.user,
          );
        }

        const user = UserDrizzleModelMapper.toEntity(item.user);
        // const user = UserItemRefDrizzleModelMapper.toEntity(item.user);

        return InventoryItemMapper.toDomain(
          {
            amount: item.amount,
          },
          {
            item: itemData,
            character: user,
          },
        );
      }),
    );

    return entities;
  }
}
