import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { WeaponEntity } from './weapon.entity.js';

export class OneHandedWeaponEntity extends WeaponEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }
  protected override applyEffect(character: UserItemRef): void {
    if (character.leftHand === null) {
      this.equipped = true;
      character.leftHand = this;
    } else {
      if (character.leftHand === this) {
        character.leftHand.equipped = false;
        character.leftHand = null;

        return;
      }

      if (character.rightHand !== null) {
        character.rightHand.equipped = false;
      }

      character.rightHand = character.leftHand;
      this.equipped = true;
      character.leftHand = this;
    }
  }
}
