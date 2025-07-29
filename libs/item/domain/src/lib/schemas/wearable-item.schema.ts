import z from 'zod';

import { itemSchema } from './item.schema.js';

export const wearableItemSchema = itemSchema.extend({
  equipped: z.boolean().default(false),
});

export const wearableItemPropsSchema = wearableItemSchema;

export type WearableItem = z.infer<typeof wearableItemSchema>;
export type WearableItemProps = z.infer<typeof wearableItemPropsSchema>;
