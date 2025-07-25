import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class BootsEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedBoots) {
      character.equippedBoots.equipped = false;

      if (character.equippedBoots.id === this.id) {
        character.equippedBoots = null;
      } else {
        this.equipped = true;
        character.equippedBoots = this;
      }
    }
  }
}
