import type { InventoryEntityRelations } from '../entities/inventory-item.entity.js';
import type { UserItemProps } from '../schemas/inventory.schema.js';
import { InventoryItemEntity } from '../entities/inventory-item.entity.js';

export class InventoryItemMapper {
  static toDomain(
    { amount }: UserItemProps,
    relations: InventoryEntityRelations,
  ) {
    const inventoryItem = new InventoryItemEntity(
      { amount: amount ?? 0 },
      {
        item: relations.item,
        character: relations.character,
      },
    );

    return inventoryItem;
  }
}
