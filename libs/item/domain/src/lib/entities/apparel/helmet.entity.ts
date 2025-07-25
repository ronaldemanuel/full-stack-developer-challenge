import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class HelmetEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedHelmet === this) {
      this.equipped = false;
      character.equippedHelmet = null;
      return;
    }

    if (character.equippedHelmet) {
      character.equippedHelmet.equipped = false;
    }

    this.equipped = true;
    character.equippedHelmet = this;
  }
}
