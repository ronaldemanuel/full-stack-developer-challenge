import z from 'zod';

import { apparelItemSchema } from './apparel.schema';
import { consumableItemSchema } from './consumable.schema';
import { itemSchema } from './item.schema';
import { weaponItemSchema } from './weapon.schema';

export const inventoryPropsSchema = z.object({
  amount: z.number().nullable(),
  item: z.union([
    itemSchema,
    apparelItemSchema,
    weaponItemSchema,
    consumableItemSchema,
  ]),
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
