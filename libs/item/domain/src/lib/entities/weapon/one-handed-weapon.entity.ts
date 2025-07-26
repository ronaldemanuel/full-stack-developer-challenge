import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { WeaponEntity } from './weapon.entity.js';

export class OneHandedWeaponEntity extends WeaponEntity {
  override get equipped(): boolean {
    return (
      this.character.leftHand === this || this.character.rightHand === this
    );
  }

  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.leftHand === null) {
      character.leftHand = this;
    } else {
      if (character.leftHand === this) {
        character.leftHand = null;

        return;
      }

      character.rightHand = character.leftHand;
      character.leftHand = this;
    }
  }
}
