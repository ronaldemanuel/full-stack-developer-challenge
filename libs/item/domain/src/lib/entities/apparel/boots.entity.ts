import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class BootsEntity extends ApparelEntity {
  override get equipped(): boolean {
    return this.character?.equippedBoots === this;
  }

  override set equipped(value: boolean) {
    this.equipped = value;
  }

  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedBoots === this) {
      this.equipped = false;
      character.equippedBoots = null;
      return;
    }

    if (character.equippedBoots) {
      character.equippedBoots.equipped = false;
    }

    this.equipped = true;
    character.equippedBoots = this;
  }
}
