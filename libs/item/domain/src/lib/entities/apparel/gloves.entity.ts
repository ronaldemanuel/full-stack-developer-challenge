import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class GlovesEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedGloves === this) {
      this.equipped = false;
      character.equippedGloves = null;
      return;
    }

    if (character.equippedGloves) {
      character.equippedGloves.equipped = false;
    }

    this.equipped = true;
    character.equippedGloves = this;
  }
}
