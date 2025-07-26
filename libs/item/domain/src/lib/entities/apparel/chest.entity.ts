import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ApparelEntity } from './apparel.entity.js';

export default class ChestEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  override get equipped(): boolean {
    return this.character.equippedChest === this;
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedChest === this) {
      character.equippedChest = null;
      return;
    }

    character.equippedChest = this;
  }
}
