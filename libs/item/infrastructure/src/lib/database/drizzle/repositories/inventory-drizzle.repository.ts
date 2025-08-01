import { Inject, Injectable } from '@nestjs/common';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type {
  InventoryItemEntity,
  InventoryItemEntityRelations,
  InventoryRepository,
  UserItemRef,
} from '@nx-ddd/item-domain';
import {
  InjectDrizzle,
  InjectDrizzleTransaction,
} from '@nx-ddd/database-infrastructure';
import { and, eq, gt } from '@nx-ddd/database-infrastructure/drizzle/operators';
import {
  userItem,
  user as userTable,
} from '@nx-ddd/database-infrastructure/drizzle/schema';
import {
  InventoryItemMapper,
  ItemMapper,
  ItemRepository,
} from '@nx-ddd/item-domain';
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
  update(inventoryItems: InventoryItemEntity[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async syncByUser(user: UserItemRef): Promise<void> {
    const itemsToDelete = user.$watchedRelations.inventory.getRemovedItems();
    const itemsToCreate = user.$watchedRelations.inventory.getNewItems();
    const currentItems = user.$watchedRelations.inventory.getItems();

    const itemsToUpdate = currentItems.filter((item) => {
      const isNew = itemsToCreate.some(
        (newItem) => newItem.itemId === item.itemId,
      );
      const isRemoved = itemsToDelete.some(
        (removedItem) => removedItem.itemId === item.itemId,
      );
      if (isNew || isRemoved) return false;

      return item;
    });

    if (this.userRepository) {
      await this.tx
        .update(userTable)
        .set(user.toJSON())
        .where(eq(userTable.id, user.id));
    }

    await Promise.all(
      [
        itemsToCreate.map(async (item) => {
          try {
            await this.tx.insert(userItem).values({
              itemId: item.itemId,
              userId: item.characterId,
              amount: item.amount,
            });
          } catch (error) {
            console.error(error);
          }
        }),
        itemsToDelete.map(async (item) => {
          try {
            await this.tx
              .delete(userItem)
              .where(
                and(
                  eq(userItem.itemId, item.itemId),
                  eq(userItem.userId, item.characterId),
                ),
              );
          } catch (error) {
            console.error(error);
          }
        }),
        itemsToUpdate.map(async (item) => {
          try {
            await this.tx
              .update(userItem)
              .set({ amount: item.amount })
              .where(
                and(
                  eq(userItem.itemId, item.itemId),
                  eq(userItem.userId, user.id),
                ),
              );
          } catch (error) {
            console.error(error);
          }
        }),
      ].flat(),
    );
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

    const user = UserDrizzleModelMapper.toEntity(inventoryItem.user);
    const userItemRef = UserItemRefDrizzleModelMapper.toEntity(user);

    if (this.userRepository && inventoryItem.user) {
      relations.character = userItemRef;
    }

    return InventoryItemMapper.toDomain(
      {
        amount: inventoryItem.amount,
      },
      relations,
    );
  }

  async findByUserId(userId: string): Promise<InventoryItemEntity[]> {
    const items = await this.db.query.userItem.findMany({
      where: (fields, { and }) =>
        and(eq(fields.userId, userId), gt(fields.amount, 0)),
      with: {
        user: this.userRepository ? true : undefined,
      },
    });

    const entities = await Promise.all(
      items.map(async (item) => {
        const itemData = await this.itemRepository.findById(item.itemId);
        if (!itemData) throw new NotFoundError('Item no found');

        const user = UserDrizzleModelMapper.toEntity(item.user);
        const userItemRef = UserItemRefDrizzleModelMapper.toEntity(user);

        const itemEntity = ItemMapper.toDomain(itemData, userItemRef);

        const inventoryItemRelations: InventoryItemEntityRelations = {
          item: itemEntity,
        };

        if (this.userRepository) {
          inventoryItemRelations.character = userItemRef;
        }

        return InventoryItemMapper.toDomain(
          {
            amount: item.amount,
          },
          inventoryItemRelations,
        );
      }),
    );

    return entities;
  }
}
