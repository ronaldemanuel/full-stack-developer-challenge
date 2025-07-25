import { WearableItemsEntity } from '../wearable-items.entity.js';

export abstract class WeaponEntity extends WearableItemsEntity {
  damageValue = 0;
}
