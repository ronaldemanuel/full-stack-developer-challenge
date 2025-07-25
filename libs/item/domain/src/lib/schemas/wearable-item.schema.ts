import z from 'zod';

import { itemPropsSchema } from './item.schema.js';

export const wearableItemSchema = itemPropsSchema.extend({
  equipped: z.boolean().default(false),
});

export const wearableItemPropsSchema = wearableItemSchema;

export type WearableItem = z.infer<typeof wearableItemSchema>;
export type WearableItemProps = z.infer<typeof wearableItemPropsSchema>;
