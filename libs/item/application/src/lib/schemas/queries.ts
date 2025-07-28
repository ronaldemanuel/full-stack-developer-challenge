import z from 'zod';

import { userItemRefPropsSchema, userItemRefSchema } from '@nx-ddd/item-domain';

export const getUserInventoryInputSchema = userItemRefPropsSchema;

export const getAllItemsInputSchema = z.object({});

export type GetUserInventoryInput = z.infer<typeof getUserInventoryInputSchema>;
export type GetAllItemsInput = z.infer<typeof getAllItemsInputSchema>;
