import type { UserItemRef } from '../../refs/user-item.ref';
import type { ItemIdentifier } from '../abstract-item.entity';
import { WeaponEntity } from './weapon.entity';

export class TwoHandedWeaponEntity extends WeaponEntity {
  override get equipped(): boolean {
    return (
      this.character?.leftHand === this.id &&
      this.character?.rightHand === this.id
    );
  }

  protected override getIdentifier(): ItemIdentifier {
    return 'two-handed-weapon';
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.leftHand != null && character.rightHand != null) {
      if (character.leftHand === this.id && character.rightHand === this.id) {
        character.leftHand = null;
        character.rightHand = null;

        return;
      }
    }

    character.leftHand = this.id;
    character.rightHand = this.id;
  }
}
