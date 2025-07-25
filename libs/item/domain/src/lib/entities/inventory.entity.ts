import { Entity } from '@nx-ddd/shared-domain';

import type { UserItemRef } from '../refs/user-item.ref.js';
import type { InventoryProps } from '../schemas/inventory.schema.js';
import type { ItemEntity } from './abstract-item.entity.js';

interface InventoryEntityRelations {
  character: UserItemRef;
  item: ItemEntity;
}

// @ts-expect-error: Expect error because of overriding the create method
export class InventoryEntity extends Entity<InventoryProps> {
  private $relations: InventoryEntityRelations;

  constructor(
    props: InventoryProps,
    relations: InventoryEntityRelations,
    id?: string,
  ) {
    super(props, id);
    this.$relations = relations;
  }

  get character(): UserItemRef {
    return this.$relations.character;
  }

  get item(): ItemEntity {
    return this.$relations.item;
  }

  static override create(
    character: UserItemRef,
    item: ItemEntity,
  ): InventoryEntity {
    return new InventoryEntity(
      {
        characterId: character.id,
        itemId: item.id,
      },
      {
        item: item,
        character: character,
      },
    );
  }
}
