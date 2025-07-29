import type { UserItemRef } from 'src/lib/refs/user-item.ref';

import type { ItemIdentifier } from '../abstract-item.entity';
import { ApparelEntity } from './apparel.entity';

export default class BootsEntity extends ApparelEntity {
  override get equipped(): boolean {
    return this.character?.equippedBoots === this;
  }

  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedBoots === this) {
      character.equippedBoots = null;
      return;
    }

    character.equippedBoots = this;
  }
}
