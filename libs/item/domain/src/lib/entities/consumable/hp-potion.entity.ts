import type { UserItemRef } from 'src/lib/refs/user-item.ref';

import type { ItemIdentifier } from '../abstract-item.entity';
import { ConsumableEntity } from './consumable.entity';

export class HpPotionEntity extends ConsumableEntity {
  protected override getIdentifier(): ItemIdentifier {
    return 'hp-potion';
  }

  protected override applyEffect(character: UserItemRef): void {
    character.hpLevel += this.effectValue;
    this.removeItem(character);
  }
}
