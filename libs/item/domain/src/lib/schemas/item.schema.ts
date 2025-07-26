import z from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(255),
  image: z.string().url(),
  characterId: z.string().nullish(),
  type: z.enum(['apparel', 'weapon', 'consumable', 'misc']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const itemPropsSchema = itemSchema.partial({
  createdAt: true,
  updatedAt: true,
});

export type Item = z.infer<typeof itemSchema>;
export type ItemProps = z.infer<typeof itemPropsSchema>;
