import { Entity } from '@nx-ddd/shared-domain';

import type { UserItemRef } from '../refs/user-item.ref.js';
import type { ItemProps } from '../schemas/item.schema.js';

export type ItemIdentifier = 'apparel' | 'weapon' | 'consumable' | 'misc';

// @ts-expect-error: Because of the override of the create method
export abstract class ItemEntity extends Entity<ItemProps> {
  protected abstract getIdentifier(): ItemIdentifier;
  protected _character?: UserItemRef;

  get name() {
    return this.props.name ?? '';
  }

  get image() {
    return this.props.image;
  }

  get stackNumber() {
    return this.props.stackNumber ?? 0;
  }

  get character() {
    if (!this._character) {
      throw new Error('This item has no character');
    }
    return this._character;
  }

  use(): void {
    this.applyEffect(this.character);
  }

  static override create(props: ItemProps): ItemEntity {
    const item = super.create<ItemEntity, ItemProps>(props);
    item.props.createdAt = item.props.createdAt ?? new Date();
    item.props.updatedAt = item.props.updatedAt ?? new Date();
    return item;
  }

  protected abstract applyEffect(character: UserItemRef): void;
}
