import type { UserItemRef } from '../refs/user-item.ref.js';
import type { ItemEntity } from './abstract-item.entity.js';

export class UserItemEntity {
  protected character: UserItemRef;
  protected items: ItemEntity[];
}
