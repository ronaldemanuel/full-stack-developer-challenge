import z from 'zod';

import { itemPropsSchema, userItemRefPropsSchema } from '@nx-ddd/item-domain';

export const getUserInventoryInputSchema = userItemRefPropsSchema;

export const getAllItemsInputSchema = z.object({});

export const getUserInventoryOutputSchema = itemPropsSchema.extend({
  amount: z.number().default(0),
});

export type GetUserInventoryInput = z.infer<typeof getUserInventoryInputSchema>;
export type GetAllItemsInput = z.infer<typeof getAllItemsInputSchema>;
export type GetUserInventoryOutput = z.infer<
  typeof getUserInventoryOutputSchema
>;
