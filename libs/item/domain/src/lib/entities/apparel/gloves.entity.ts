import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class GlovesEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedGloves) {
      character.equippedGloves.equipped = false;

      if (character.equippedGloves.id === this.id) {
        character.equippedGloves = null;
      } else {
        this.equipped = true;
        character.equippedGloves = this;
      }
    }
  }
}
