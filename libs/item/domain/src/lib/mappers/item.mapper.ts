import type { ITEMS } from '../constants/items.js';
import type { ItemEntity } from '../entities/abstract-item.entity.js';
import type { UserItemRef } from '../refs/user-item.ref.js';
import type { ApparelItemSchemaProps } from '../schemas/apparel.schema.js';
import type { ItemProps } from '../schemas/item.schema.js';
import BootsEntity from '../entities/apparel/boots.entity.js';
import ChestEntity from '../entities/apparel/chest.entity.js';
import GlovesEntity from '../entities/apparel/gloves.entity.js';
import HelmetEntity from '../entities/apparel/helmet.entity.js';

export class ItemMapper {
  static toDomain(
    item: ItemProps | ApparelItemSchemaProps,
    character?: UserItemRef,
  ): ItemEntity {
    type EntityConstructor<T extends ItemEntity = ItemEntity> = new (
      props: any,
      relations?: any,
      id?: any,
    ) => T;

    const classesMap: Record<keyof typeof ITEMS, EntityConstructor> = {
      'dragonscale-helmet': HelmetEntity,
      'dragonscale-armor': ChestEntity,
      'dragonscale-boots': BootsEntity,
      'dragonscale-gautlets': GlovesEntity,
      'leather-helmet': HelmetEntity,
    };

    const ItemClass =
      item.id in classesMap && classesMap[item.id as keyof typeof ITEMS];

    if (!ItemClass) {
      throw new Error(`Item class not found for identifier: ${item.id}`);
    }

    return new ItemClass(item, () => ({ character: character }), item.id);
  }
}
