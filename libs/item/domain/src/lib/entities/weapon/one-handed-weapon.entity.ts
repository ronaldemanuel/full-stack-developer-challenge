import type { UserItemRef } from 'src/lib/refs/user-item.ref';

import type { ItemIdentifier } from '../abstract-item.entity';
import { WeaponEntity } from './weapon.entity';

export class OneHandedWeaponEntity extends WeaponEntity {
  override get equipped(): boolean {
    return (
      this.character?.leftHand === this || this.character?.rightHand === this
    );
  }

  protected override getIdentifier(): ItemIdentifier {
    return 'one-handed-weapon';
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
