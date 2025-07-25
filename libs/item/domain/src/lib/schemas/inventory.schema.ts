import z from 'zod';

export const inventorySchema = z.object({
  id: z.string(),
  characterId: z.string(),
  itemId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const inventoryPropsSchema = inventorySchema
  .omit({
    id: true,
  })
  .partial({
    updatedAt: true,
    createdAt: true,
  });

export type Inventory = z.infer<typeof inventorySchema>;
export type InventoryProps = z.infer<typeof inventoryPropsSchema>;
