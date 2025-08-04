import type { UserItemRef } from '../refs/user-item.ref';
import type { ItemIdentifier } from './abstract-item.entity';
import { ItemEntity } from './abstract-item.entity';

export class MiscItemEntity extends ItemEntity {
  protected override getIdentifier(): ItemIdentifier {
    return 'misc';
  }

  protected override applyEffect(character: UserItemRef): void {
    throw new Error('Misc items cannot be used');
  }
}
