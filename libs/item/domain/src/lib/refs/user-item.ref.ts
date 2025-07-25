import type { UserProps } from '@nx-ddd/user-domain';
import { RelationshipNotLoadedError } from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { ItemEntity } from '../entities/abstract-item.entity.js';
import type BootsEntity from '../entities/apparel/boots.entity.js';
import type ChestEntity from '../entities/apparel/chest.entity.js';
import type GlovesEntity from '../entities/apparel/gloves.entity.js';
import type HelmetEntity from '../entities/apparel/helmet.entity.js';
import type { WeaponEntity } from '../entities/weapon/weapon.entity.js';

export interface UserItemRefRelations {
  inventory: ItemEntity[];
}

export class UserItemRef extends UserEntity {
  private $relations: () => UserItemRefRelations;

  constructor(
    props: UserProps,
    relations: () => UserItemRefRelations = () => {
      throw new RelationshipNotLoadedError('Relations not provided');
    },
    id?: string,
  ) {
    super(props, id);
    this.$relations = relations;
  }

  get inventory(): ItemEntity[] {
    return this.$relations().inventory;
  }

  equippedHelmet: HelmetEntity | null = null;
  equippedChest: ChestEntity | null = null;
  equippedBoots: BootsEntity | null = null;
  equippedGloves: GlovesEntity | null = null;

  leftHand: WeaponEntity | null = null;
  rightHand: WeaponEntity | null = null;

  get constitution(): number {
    const helmet = this.equippedHelmet?.defenseValue ?? 0;
    const chest = this.equippedChest?.defenseValue ?? 0;
    const boots = this.equippedBoots?.defenseValue ?? 0;
    const gloves = this.equippedGloves?.defenseValue ?? 0;

    return helmet + chest + boots + gloves;
  }

  get damage(): number {
    const left = this.leftHand;
    const right = this.rightHand;

    if (!left && !right) {
      return 0;
    }

    if (left && right) {
      if (left === right) {
        return left.damageValue ?? 0;
      }

      const leftDamage = left.damageValue ?? 0;
      const rightDamage = right.damageValue ?? 0;
      return leftDamage + rightDamage;
    }

    return left?.damageValue ?? right?.damageValue ?? 0;
  }
}
