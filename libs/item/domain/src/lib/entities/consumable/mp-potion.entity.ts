import type { UserItemRef } from 'src/lib/refs/user-item.ref';

import type { ItemIdentifier } from '../abstract-item.entity';
import { ConsumableEntity } from './consumable.entity';

export class MpPotionEntity extends ConsumableEntity {
  protected override getIdentifier(): ItemIdentifier {
    return 'mp-potion';
  }

  protected override applyEffect(character: UserItemRef): void {
    const { mpLevel } = character;

    if (mpLevel === 100) {
      throw new Error('Item cannot be used: MP is full');
    }

    character.mpLevel =
      mpLevel + this.effectValue < 100 ? this.effectValue + mpLevel : 100;

    this.removeItem(character);
  }
}
