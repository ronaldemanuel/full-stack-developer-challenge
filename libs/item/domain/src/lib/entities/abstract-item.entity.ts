import { Entity } from '@nx-ddd/shared-domain';

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
  character: UserItemRef;
  inventory?: InventoryItemEntity;
}
export abstract class ItemEntity<
  T extends ItemProps = ItemProps,
> extends Entity<T> {
  private $relations: () => ItemRelations;
  protected abstract getIdentifier(): ItemIdentifier;

  constructor(dataProps: T, relations: () => ItemRelations, id?: string) {
    const { id: identifier, ...props } = ITEMS[id!];

    const combinedProps = {
      ...props,
      ...dataProps,
      id: id ?? identifier,
    } as T;

    super(combinedProps, id);

    this.$relations = relations;
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
    return this.$relations().character;
  }

  set character(character: UserItemRef) {
    this.$relations().character = character;
  }

  get amount() {
    return this.$relations().inventory?.amount ?? 0;
  }

  use(): void {
    this.applyEffect(this.$relations().character);
  }

  protected abstract applyEffect(character: UserItemRef): void;
}
