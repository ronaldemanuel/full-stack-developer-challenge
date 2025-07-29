import z from 'zod';

import { wearableItemSchema } from './wearable-item.schema';

export const weaponItemSchema = wearableItemSchema.extend({
  damageValue: z.number().int().default(1),
  weaponType: z.enum(['one-hand', 'two-hands']),
});

export type WeaponItemProps = z.infer<typeof weaponItemSchema>;
