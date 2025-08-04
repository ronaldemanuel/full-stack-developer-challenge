import z from 'zod';

import { wearableItemSchema } from './wearable-item.schema';

export const weaponItemSchema = wearableItemSchema.extend({
  damageValue: z.number().int().default(1),
  weaponType: z.enum(['one-hand', 'two-hands']),
  onLeftHand: z.boolean().default(false),
  onRightHand: z.boolean().default(false),
});

export type WeaponItemProps = z.infer<typeof weaponItemSchema>;
