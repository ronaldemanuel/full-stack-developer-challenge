import type { UserItemRef } from 'src/lib/refs/user-item.ref';

import type { ItemIdentifier } from '../abstract-item.entity';
import { ApparelEntity } from './apparel.entity';

export class BootsEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    return 'boots';
  }
  override get equipped(): boolean {
    return this.character?.equippedBoots === this;
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedBoots === this) {
      character.equippedBoots = null;
      return;
    }

    character.equippedBoots = this;
  }
}
