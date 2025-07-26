import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import { ItemEntity } from '../abstract-item.entity.js';

export abstract class ConsumableEntity extends ItemEntity {
  protected effectLevel = 1;

  protected removeItem(character: UserItemRef) {
    character.removeItemFromInventory(this.id);
  }
}
