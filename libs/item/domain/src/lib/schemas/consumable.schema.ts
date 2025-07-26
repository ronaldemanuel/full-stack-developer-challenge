import z from 'zod';

import { itemPropsSchema } from './item.schema.js';

export const consumableItemSchema = itemPropsSchema.extend({
  effectValue: z.number().int().default(1),
  consumableType: z.enum(['hp-potion', 'mp-potion', 'sp-potion']),
});

export type ConsumableItemProps = z.infer<typeof consumableItemSchema>;
