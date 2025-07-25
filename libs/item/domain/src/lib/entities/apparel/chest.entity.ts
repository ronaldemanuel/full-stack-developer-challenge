import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class ChestEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedChest === this) {
      this.equipped = false;
      character.equippedChest = null;
      return;
    }

    if (character.equippedChest) {
      character.equippedChest.equipped = false;
    }

    this.equipped = true;
    character.equippedChest = this;
  }
}
