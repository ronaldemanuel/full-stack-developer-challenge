import { Entity, RelationshipNotLoadedError } from '@nx-ddd/shared-domain';

import type { UserItemRef } from '../refs/user-item.ref';
import type { ItemProps } from '../schemas/item.schema';
import type { InventoryItemEntity } from './inventory-item.entity';
import { ITEMS } from '../constants/items';

export type ItemIdentifier =
  | 'boots'
  | 'chest'
  | 'helmet'
  | 'gloves'
  | 'hp-potion'
  | 'mp-potion'
  | 'sp-potion'
  | 'one-handed-weapon'
  | 'two-handed-weapon'
  | 'misc';

export interface ItemRelations {
  character?: UserItemRef;
  inventory?: InventoryItemEntity;
}
export abstract class ItemEntity<
  T extends ItemProps = ItemProps,
> extends Entity<T> {
  private _character?: UserItemRef;

  protected abstract getIdentifier(): ItemIdentifier;

  constructor(dataProps: T, relations?: () => ItemRelations, id?: string) {
    super({} as unknown as T, id);

    const { id: identifier, ...props } = ITEMS[id!];
    Object.assign(this.props, {
      ...props,
      ...dataProps,
      id: id ?? identifier,
    });
    // this._owner = owner;
  }

  get name() {
    return this.props.name ?? '';
  }

  get image() {
    return this.props.image;
  }

  get type() {
    return this.props.type;
  }

  get price() {
    return this.props.price;
  }

  get weight() {
    return this.props.weight;
  }

  get character() {
    if (!this._character) {
      throw new RelationshipNotLoadedError(
        'Character not loaded for this item',
      );
    }

    return this._character;
  }

  set character(character: UserItemRef) {
    this._character = character;
  }

  get inventory() {
    if (!this._character) {
      throw new RelationshipNotLoadedError(
        'Character not loaded for this item',
      );
    }

    return this._character;
  }

  use(): void {
    this.applyEffect(this.character);
  }

  protected abstract applyEffect(character: UserItemRef): void;
}
