import type { UserItemRef } from '../refs/user-item.ref';
import type { ItemIdentifier } from './abstract-item.entity';
import { ItemEntity } from './abstract-item.entity';

export default class BundleEntity extends ItemEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {}
}
