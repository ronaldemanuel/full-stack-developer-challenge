import z from 'zod';

import { itemSchema } from './item.schema.js';

export const consumableItemSchema = itemSchema.extend({
  effectValue: z.number().int().default(1),
  consumableType: z.enum(['hp-potion', 'mp-potion', 'sp-potion']),
});

export type ConsumableItemProps = z.infer<typeof consumableItemSchema>;
