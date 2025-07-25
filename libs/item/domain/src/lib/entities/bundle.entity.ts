import type { UserItemRef } from '../refs/user-item.ref.js';
import type { ItemIdentifier } from './abstract-item.entity.js';
import { ItemEntity } from './abstract-item.entity.js';

export default class BundleEntity extends ItemEntity {
  protected override getIdentifier(): ItemIdentifier {
    throw new Error('Method not implemented.');
  }

  protected override applyEffect(character: UserItemRef): void {}
}
