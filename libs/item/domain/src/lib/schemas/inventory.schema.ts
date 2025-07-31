import z from 'zod';

export const inventoryPropsSchema = z.object({
  amount: z.number().nullable(),
});

export const userItemPropsSchema = inventoryPropsSchema.partial({
  amount: true,
});

export const userItemSchema = inventoryPropsSchema.extend({
  characterId: z.string(),
  itemId: z.string(),
});

export type InventoryProps = z.infer<typeof inventoryPropsSchema>;
export type UserItemProps = z.infer<typeof userItemPropsSchema>;
