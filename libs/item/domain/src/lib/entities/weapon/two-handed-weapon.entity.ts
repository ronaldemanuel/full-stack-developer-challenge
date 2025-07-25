import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { WeaponEntity } from './weapon.entity.js';

export default class TwoHandedWeaponEntity extends WeaponEntity {
  override get equipped(): boolean {
    return (
      this.character.leftHand === this && this.character.rightHand === this
    );
  }

  override set equipped(value: boolean) {
    this.equipped = value;
  }

  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.leftHand != null && character.rightHand != null) {
      character.leftHand.equipped = false;
      character.rightHand.equipped = false;

      if (character.leftHand === this && character.rightHand === this) {
        character.leftHand = null;
        character.rightHand = null;

        return;
      }
    }

    this.equipped = true;
    character.leftHand = this;
    character.rightHand = this;
  }
}
