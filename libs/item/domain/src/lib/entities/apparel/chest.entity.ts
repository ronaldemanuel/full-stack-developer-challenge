import type { UserItemRef } from '../../refs/user-item.ref';
import type { ItemIdentifier } from '../abstract-item.entity';
import { ApparelEntity } from './apparel.entity';

export class ChestEntity extends ApparelEntity {
  protected override getIdentifier(): ItemIdentifier {
    return 'chest';
  }

  override get equipped(): boolean {
    return this.character?.equippedChest === this.id;
  }

  protected override applyEffect(character: UserItemRef): void {
    if (character.equippedChest === this.id) {
      character.equippedChest = null;
      return;
    }

    character.equippedChest = this.id;
  }
}
