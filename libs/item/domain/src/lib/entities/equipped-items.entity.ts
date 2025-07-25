import { ItemEntity } from './abstract-item.entity.js';

export abstract class EquippedItemsEntity extends ItemEntity {
  equipped = false;
}
