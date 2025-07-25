import type { UserItemRef } from 'src/lib/refs/user-item.ref.js';

import type { ItemIdentifier } from '../abstract-item.entity.js';
import { ConsumableEntity } from './consumable.entity.js';

export class MpPotionEntity extends ConsumableEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    this.consume();
    character.mpLevel += this.effectLevel;
  }
}
