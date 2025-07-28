import z from 'zod';

export const getUserInventoryInputSchema = z.object({
  userId: z.string(),
});

export const getAllItemsInputSchema = z.object({});

export type GetUserInventoryInput = z.infer<typeof getUserInventoryInputSchema>;
export type GetAllItemsInput = z.infer<typeof getAllItemsInputSchema>;
