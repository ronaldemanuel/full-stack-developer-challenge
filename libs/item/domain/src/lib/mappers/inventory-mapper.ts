import type { InventoryItemEntityRelations } from '../entities/inventory-item.entity';
import type { UserItemProps } from '../schemas/inventory.schema';
import { InventoryItemEntity } from '../entities/inventory-item.entity';

export class InventoryItemMapper {
  static toDomain(
    { amount }: UserItemProps,
    relations: InventoryItemEntityRelations,
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
