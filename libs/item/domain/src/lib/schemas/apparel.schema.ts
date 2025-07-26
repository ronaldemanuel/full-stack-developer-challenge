import z from 'zod';

import { wearableItemSchema } from './wearable-item.schema.js';

export const apparelItemSchema = wearableItemSchema.extend({
  defenseValue: z.number().int().default(1),
  apparelType: z.enum(['helmet', 'chest', 'gloves', 'boots']),
});

export const apparelItemPropsSchema = apparelItemSchema;

export type ApparelItemSchema = z.infer<typeof apparelItemSchema>;
export type ApparelItemSchemaProps = z.infer<typeof apparelItemPropsSchema>;
