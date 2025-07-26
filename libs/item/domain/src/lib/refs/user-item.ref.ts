import {
  NotFoundError,
  RelationshipNotLoadedError,
} from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { ItemEntity } from '../entities/abstract-item.entity.js';
import type BootsEntity from '../entities/apparel/boots.entity.js';
import type ChestEntity from '../entities/apparel/chest.entity.js';
import type GlovesEntity from '../entities/apparel/gloves.entity.js';
import type HelmetEntity from '../entities/apparel/helmet.entity.js';
import type { InventoryEntity } from '../entities/inventory.entity.js';
import type { WeaponEntity } from '../entities/weapon/weapon.entity.js';
import type { UserItemRefProps } from '../schemas/user-item-ref.schema.js';
import { InventoryMapper } from '../mappers/inventory-mapper.js';

export interface UserItemRefRelations {
  inventory?: InventoryEntity[];
}

// @ts-expect-error: Expect error because of the override of the cast method
export class UserItemRef extends UserEntity {
  private $relations: () => UserItemRefRelations;
  equippedHelmet: HelmetEntity | null = null;
  equippedChest: ChestEntity | null = null;
  equippedBoots: BootsEntity | null = null;
  equippedGloves: GlovesEntity | null = null;

  leftHand: WeaponEntity | null = null;
  rightHand: WeaponEntity | null = null;

  protected override props: UserItemRefProps;

  constructor(
    props: UserItemRefProps,
    relations: () => UserItemRefRelations = () => {
      throw new RelationshipNotLoadedError('Relations not provided');
    },
    id?: string,
  ) {
    super(props, id);
    this.props = props;
    this.$relations = relations;
  }

  get inventory(): InventoryEntity[] {
    const inventory = this.$relations().inventory;

    if (inventory === undefined) {
      throw new RelationshipNotLoadedError('Inventory not Loaded');
    } else {
      return inventory;
    }
  }

  set inventory(newInventory: InventoryEntity[]) {
    const inventory = this.$relations().inventory;

    if (inventory) {
      this.inventory = [...this.inventory, ...newInventory];
    } else {
      this.inventory = newInventory;
    }
  }

  public addItemToInventory(item: ItemEntity): void {
    const existingItem = this.inventory.find(
      (inventoryItem) => inventoryItem.itemId === item.id,
    );

    if (existingItem) {
      existingItem.amount += 1; // Increment the amount if the item already exists
      return;
    }

    this.inventory.push(
      InventoryMapper.toDomain(
        {
          amount: 1,
        },
        {
          item,
          character: this,
        },
      ),
    );
  }

  public removeItemFromInventory(itemId: string) {
    const itemIndex = this.inventory.findIndex(
      (item) => item.itemId === itemId,
    );
    if (itemIndex === -1) {
      throw new NotFoundError('Item not found in user inventory');
    }
    this.inventory.splice(itemIndex, 1);
  }

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

  static override cast(
    user: UserEntity,
    relations: () => UserItemRefRelations = () => {
      throw new RelationshipNotLoadedError('Relations not provided');
    },
    id?: string,
  ): UserItemRef {
    const casted = super.cast<
      UserItemRefProps,
      UserEntity,
      UserItemRef,
      [() => UserItemRefRelations, id?: string]
    >(user, relations, id);

    const inventory: InventoryEntity[] = [];
    try {
      const probablyRelations = relations();
      casted.$relations = () => probablyRelations;
    } catch {
      casted.$relations = () => {
        return {
          inventory: inventory,
        };
      };
    }

    return casted;
  }
}
