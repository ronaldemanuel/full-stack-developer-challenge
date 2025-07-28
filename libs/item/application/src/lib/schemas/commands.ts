import z from 'zod';

export const useItemInputSchema = z.object({
  userId: z.string(),
  itemId: z.string(),
});

export const addItemToInventoryInputSchema = z.object({
  userId: z.string(),
  itemId: z.string(),
});

export type UseItemInput = z.infer<typeof useItemInputSchema>;
export type AddItemToInventoryInput = z.infer<
  typeof addItemToInventoryInputSchema
>;
