import {
  NotFoundError,
  RelationshipNotLoadedError,
  WatchedList,
} from '@nx-ddd/shared-domain';
import { UserEntity } from '@nx-ddd/user-domain';

import type { ItemEntity } from '../entities/abstract-item.entity.js';
import type BootsEntity from '../entities/apparel/boots.entity.js';
import type ChestEntity from '../entities/apparel/chest.entity.js';
import type GlovesEntity from '../entities/apparel/gloves.entity.js';
import type HelmetEntity from '../entities/apparel/helmet.entity.js';
import type { InventoryItemEntity } from '../entities/inventory-item.entity.js';
import type { WeaponEntity } from '../entities/weapon/weapon.entity.js';
import type { UserItemRefProps } from '../schemas/user-item-ref.schema.js';
import { InventoryItemMapper } from '../mappers/inventory-mapper.js';

export interface UserItemRefRelations {
  inventory: InventoryItemEntity[];
}

export interface UserItemRefWatchedRelations {
  inventory: WatchedList<InventoryItemEntity>;
}

// @ts-expect-error: Expect error because of the override of the cast method
export class UserItemRef extends UserEntity {
  equippedHelmet: HelmetEntity | null = null;
  equippedChest: ChestEntity | null = null;
  equippedBoots: BootsEntity | null = null;
  equippedGloves: GlovesEntity | null = null;

  leftHand: WeaponEntity | null = null;
  rightHand: WeaponEntity | null = null;

  private _inventory: WatchedList<InventoryItemEntity>;

  private $relations: () => UserItemRefRelations;

  public get $watchedRelations(): UserItemRefWatchedRelations {
    return {
      inventory: this._inventory,
    };
  }

  protected override props: UserItemRefProps;

  constructor(
    props: UserItemRefProps,
    relations: () => UserItemRefRelations,
    id?: string,
  ) {
    super(props, id);
    this.props = props;
    this.$relations = relations.bind(this);
    this._inventory = new WatchedList<InventoryItemEntity>(
      this.$relations().inventory,
    );
  }

  get inventory(): InventoryItemEntity[] {
    const inventoryItem = this._inventory.getItems();

    if (inventoryItem === undefined) {
      throw new RelationshipNotLoadedError('Inventory not Loaded');
    } else {
      return inventoryItem;
    }
  }

  set inventory(newInventory: InventoryItemEntity[]) {
    const inventoryItem = this.$relations().inventory;

    if (inventoryItem) {
      this.inventory = [...this.inventory, ...newInventory];
    } else {
      this.inventory = newInventory;
    }
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

  public addItemToInventory(item: ItemEntity): void {
    const existingItem = this.inventory.find(
      (inventory) => inventory.itemId === item.id,
    );

    if (existingItem) {
      existingItem.amount += 1;
      return;
    }

    this._inventory.add(
      InventoryItemMapper.toDomain(
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
      throw new NotFoundError('Item not found in user inventoryItem');
    }
    this.inventory.splice(itemIndex, 1);
  }

  public useItem(itemId: string) {
    const item = this.inventory.find((item) => item.itemId === itemId)?.item;

    if (!item) {
      throw new NotFoundError('Item not found on inventory');
    }
    item.use();
  }

  static override cast(
    user: UserEntity,
    relations?: () => UserItemRefRelations,
    id?: string,
  ): UserItemRef {
    if (user instanceof UserItemRef) {
      return user;
    }

    const casted = super.cast<
      UserItemRefProps,
      UserEntity,
      UserItemRef,
      [() => UserItemRefRelations, id?: string]
    >(user, (user as UserItemRef).$relations || relations, id);

    const inventory: InventoryItemEntity[] = [];
    try {
      const probablyRelations = (user as UserItemRef).$relations();
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
