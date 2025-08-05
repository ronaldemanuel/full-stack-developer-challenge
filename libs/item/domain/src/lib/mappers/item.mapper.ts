import type { ITEMS } from '../constants/items';
import type { ItemEntity } from '../entities/abstract-item.entity';
import type { UserItemRef } from '../refs';
import type { ApparelItemSchemaProps } from '../schemas/apparel.schema';
import type { ConsumableItemProps } from '../schemas/consumable.schema';
import type { ItemSchema } from '../schemas/item.schema';
import type { WeaponItemProps } from '../schemas/weapon.schema';
import { BootsEntity } from '../entities/apparel/boots.entity';
import { ChestEntity } from '../entities/apparel/chest.entity';
import { GlovesEntity } from '../entities/apparel/gloves.entity';
import { HelmetEntity } from '../entities/apparel/helmet.entity';
import { HpPotionEntity } from '../entities/consumable/hp-potion.entity';
import { MpPotionEntity } from '../entities/consumable/mp-potion.entity';
import { SpPotionEntity } from '../entities/consumable/sp-potion.entity';
import { MiscItemEntity } from '../entities/misc.entity';
import { OneHandedWeaponEntity } from '../entities/weapon/one-handed-weapon.entity';
import { TwoHandedWeaponEntity } from '../entities/weapon/two-handed-weapon.entity';

export class ItemMapper {
  static toDomain(
    item:
      | ItemSchema
      | ApparelItemSchemaProps
      | WeaponItemProps
      | ConsumableItemProps,
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
      'leather-bracers': GlovesEntity,
      'leather-armor': ChestEntity,
      'leather-boots': BootsEntity,
      'daedric-battleaxe': TwoHandedWeaponEntity,
      'ebony-sword': OneHandedWeaponEntity,
      'iron-sword': OneHandedWeaponEntity,
      'potion-of-health': HpPotionEntity,
      'potion-of-enhanced-stamina': SpPotionEntity,
      'potion-of-extra-magicka': MpPotionEntity,
      'dragon-bone': MiscItemEntity,
      'diamond': MiscItemEntity,
      'silver-ingot': MiscItemEntity,
      'coin': MiscItemEntity,
      'potion-of-minor-stamina': SpPotionEntity,
      'trollsbane': TwoHandedWeaponEntity,
    };

    const ItemClass =
      item.id in classesMap && classesMap[item.id as keyof typeof ITEMS];

    if (!ItemClass) {
      throw new Error(`Item class not found for identifier: ${item.id}`);
    }

    return new ItemClass(item, () => ({ character }), item.id);
  }
}
