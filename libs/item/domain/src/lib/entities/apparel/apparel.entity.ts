import type { apparelItemPropsSchema } from 'src/lib/schemas/apparel.schema.js';
import type z from 'zod';

import { WearableItemsEntity } from '../wearable-items.entity.js';

type ApparelItemsProps = z.infer<typeof apparelItemPropsSchema>;
export abstract class ApparelEntity<
  T extends ApparelItemsProps = ApparelItemsProps,
> extends WearableItemsEntity<T> {
  get defenseValue(): number {
    return this.props.defenseValue;
  }
}
