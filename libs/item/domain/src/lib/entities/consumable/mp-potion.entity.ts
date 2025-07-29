import type { UserItemRef } from 'src/lib/refs/user-item.ref';

import type { ItemIdentifier } from '../abstract-item.entity';
import { ConsumableEntity } from './consumable.entity';

export class MpPotionEntity extends ConsumableEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {
    character.mpLevel += this.effectValue;
    this.removeItem(character);
  }
}
