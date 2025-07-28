import type z from 'zod';

import type { apparelItemPropsSchema } from '../../schemas/apparel.schema.js';
import { WearableItemsEntity } from '../wearable-items.entity.js';

type ApparelItemsProps = z.infer<typeof apparelItemPropsSchema>;
export abstract class ApparelEntity<
  T extends ApparelItemsProps = ApparelItemsProps,
> extends WearableItemsEntity<T> {
  get defenseValue(): number {
    return this.props.defenseValue;
  }

  get apparelType(): 'helmet' | 'chest' | 'gloves' | 'boots' {
    return this.props.apparelType;
  }
}
