import z from 'zod';

export const useItemInputSchema = z.object({
  itemId: z.string(),
});

export const addItemToInventoryInputSchema = z.object({
  itemId: z.string(),
});

export type UseItemInput = z.infer<typeof useItemInputSchema>;
export type AddItemToInventoryInput = z.infer<
  typeof addItemToInventoryInputSchema
>;
