import type { UserItemRef } from '../../refs';
import type { ItemIdentifier } from '../abstract-item.entity';
import { WeaponEntity } from './weapon.entity';

export class OneHandedWeaponEntity extends WeaponEntity {
  override get equipped(): boolean {
    return (
      this.character?.leftHand === this.id ||
      this.character?.rightHand === this.id
    );
  }

  protected override getIdentifier(): ItemIdentifier {
    return 'one-handed-weapon';
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.leftHand === null) {
      character.leftHand = this.id;
    } else {
      if (character.leftHand === this.id) {
        character.leftHand = null;

        return;
      }

      if (character.rightHand === this.id) {
        character.rightHand = null;

        return;
      }

      character.rightHand =
        character.rightHand === character.leftHand ? null : character.leftHand!;
      character.leftHand = this.id;
    }
  }
}
