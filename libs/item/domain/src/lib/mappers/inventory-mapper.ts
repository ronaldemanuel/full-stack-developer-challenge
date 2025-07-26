import type { InventoryEntityRelations } from '../entities/inventory.entity.js';
import type { UserItemProps } from '../schemas/inventory.schema.js';
import { InventoryEntity } from '../entities/inventory.entity.js';

export class InventoryMapper {
  static toDomain(
    { amount }: UserItemProps,
    relations: InventoryEntityRelations,
  ) {
    const inventoryItem = new InventoryEntity(
      { amount: amount ?? 0 },
      {
        item: relations.item,
        character: relations.character,
      },
    );

    return inventoryItem;
  }

  // static toPresentation(inventoryItem: InventoryItemEntity): ItemSchema {
  //   return {
  //     ...inventoryItem.item.toJSON(),
  //     meta: {
  //       amount: inventoryItem.amount,
  //     },
  //   };
  // }
}
