import { Entity, RelationshipNotLoadedError } from '@nx-ddd/shared-domain';

import type { UserItemRef } from '../refs/user-item.ref';
import type { UserItemProps } from '../schemas/inventory.schema';
import type { ItemEntity } from './abstract-item.entity';

export interface InventoryItemEntityRelations {
  character?: UserItemRef;
  item?: ItemEntity;
}

export class InventoryItemEntity extends Entity<UserItemProps> {
  private $relations: InventoryItemEntityRelations;

  constructor(
    props: UserItemProps,
    relations: InventoryItemEntityRelations,
    id?: string,
  ) {
    super(props, id);
    this.$relations = relations;
  }

  get itemId(): string {
    return this.item.id;
  }

  get characterId() {
    if (!this.character) {
      throw new RelationshipNotLoadedError('User not loaded');
    }

    return this.character.id;
  }

  get character(): UserItemRef {
    const character = this.$relations.character;
    if (!character) {
      throw new RelationshipNotLoadedError('User not loaded');
    }
    return character;
  }

  get amount() {
    return this.props.amount ?? 0;
  }

  set amount(value: number) {
    if (value < 0) {
      throw new Error('Amount cannot be less than 0');
    }
    this.props.amount = value;
  }

  get item(): ItemEntity {
    const item = this.$relations.item;
    if (!item) {
      throw new RelationshipNotLoadedError('Item not loaded');
    }
    return item;
  }

  override equals(entity: InventoryItemEntity): boolean {
    const initialEquals = super.equals(entity);
    return initialEquals && this.amount === entity.amount;
  }
}
