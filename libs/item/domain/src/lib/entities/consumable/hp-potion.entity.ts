import type { UserItemRef } from 'src/lib/refs/user-item.ref';

import type { ItemIdentifier } from '../abstract-item.entity';
import { ConsumableEntity } from './consumable.entity';

export class HpPotionEntity extends ConsumableEntity {
  protected override getIdentifier(): ItemIdentifier {
    return 'hp-potion';
  }

  protected override applyEffect(character: UserItemRef): void {
    const { hpLevel } = character;

    if (hpLevel === 100) {
      throw new Error('Item cannot be used: HP is full');
    }

    character.hpLevel =
      hpLevel + this.effectValue < 100 ? this.effectValue + hpLevel : 100;

    this.removeItem(character);
  }
}
