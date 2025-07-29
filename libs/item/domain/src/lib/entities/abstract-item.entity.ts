import { Entity } from '@nx-ddd/shared-domain';

import type { UserItemRef } from '../refs/user-item.ref';
import type { ItemProps } from '../schemas/item.schema';

export type ItemIdentifier = 'apparel' | 'weapon' | 'consumable' | 'misc';

export interface ItemRelations {
  character?: UserItemRef;
}

export abstract class ItemEntity<
  T extends ItemProps = ItemProps,
> extends Entity<T> {
  private $relations: () => ItemRelations;

  protected abstract getIdentifier(): ItemIdentifier;

  constructor(props: T, relations: () => ItemRelations, id?: string) {
    super(props, id);
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

  get character() {
    const character = this.$relations().character;
    if (character === undefined) {
      throw new Error('This item has no character');
    } else {
      return character;
    }
  }

  set character(character: UserItemRef) {
    this.$relations().character = character;
  }

  use(): void {
    this.applyEffect(this.character);
  }

  protected abstract applyEffect(character: UserItemRef): void;
}
