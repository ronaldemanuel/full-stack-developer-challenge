import z from 'zod';

import { itemPropsSchema } from '@nx-ddd/item-domain';

export const getUserInventoryInputSchema = z.object({
  userId: z.string(),
  type: z.enum(['weapon', 'apparel', 'misc', 'all', 'consumable']),
});

export const getAllItemsInputSchema = z.object({});

export const getUserInventoryOutputSchema = itemPropsSchema.extend({
  amount: z.number().default(0),
});

export type GetUserInventoryInput = z.infer<typeof getUserInventoryInputSchema>;
export type GetAllItemsInput = z.infer<typeof getAllItemsInputSchema>;
export type GetUserInventoryOutput = z.infer<
  typeof getUserInventoryOutputSchema
>;
