import type { UserItemRef } from '../../refs/user-item.ref';
import type { ItemIdentifier } from '../abstract-item.entity';
import { ConsumableEntity } from './consumable.entity';

export class SpPotionEntity extends ConsumableEntity {
  protected override getIdentifier(): ItemIdentifier {
    return 'sp-potion';
  }

  protected override applyEffect(character: UserItemRef): void {
    const { spLevel } = character;

    if (spLevel === 100) {
      throw new Error('Item cannot be used: SP is full');
    }
    character.spLevel =
      spLevel + this.effectValue < 100 ? this.effectValue + spLevel : 100;

    this.removeItem(character);
  }
}
