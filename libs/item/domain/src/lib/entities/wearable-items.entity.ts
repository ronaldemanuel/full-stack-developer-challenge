import type z from 'zod';

import type { wearableItemPropsSchema } from '../schemas/wearable-item.schema.js';
import { ItemEntity } from './abstract-item.entity.js';

type WearableItemsProps = z.infer<typeof wearableItemPropsSchema>;
export abstract class WearableItemsEntity<
  T extends WearableItemsProps = WearableItemsProps,
> extends ItemEntity<T> {
  abstract get equipped(): boolean;

  abstract set equipped(value: boolean);
}
