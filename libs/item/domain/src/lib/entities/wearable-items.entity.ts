import type z from 'zod';

import type { wearableItemPropsSchema } from '../schemas/wearable-item.schema';
import { ItemEntity } from './abstract-item.entity';

type WearableItemsProps = z.infer<typeof wearableItemPropsSchema>;
export abstract class WearableItemsEntity<
  T extends WearableItemsProps = WearableItemsProps,
> extends ItemEntity<T> {
  abstract get equipped(): boolean;
}
