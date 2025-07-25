import z from 'zod';

export const wearableItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(255),
  image: z.string().url(),
  stackNumber: z.number().int(),
  equipped: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const wearableItemPropsSchema = wearableItemSchema
  .omit({
    id: true,
  })
  .partial({
    createdAt: true,
    updatedAt: true,
  });

export type WearableItem = z.infer<typeof wearableItemSchema>;
export type WearableItemProps = z.infer<typeof wearableItemPropsSchema>;
