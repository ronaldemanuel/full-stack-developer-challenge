import type { WearableItemProps } from '../schemas/wearable-item.schema.js';
import { ItemEntity } from './abstract-item.entity.js';

export abstract class WearableItemsEntity extends ItemEntity {
  equipped = false;

  constructor(props: WearableItemProps, id?: string) {
    super(
      {
        ...props,
      },
      id,
    );
  }
}
