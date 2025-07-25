import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class ChestEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedChest) {
      character.equippedChest.equipped = false;

      if (character.equippedChest.id === this.id) {
        character.equippedChest = null;
      } else {
        this.equipped = true;
        character.equippedChest = this;
      }
    }
  }
}
