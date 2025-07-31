import z from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(255),
  image: z.string().url(),
  characterId: z.string().nullish(),
  type: z.enum(['apparel', 'weapon', 'consumable', 'misc']),
  price: z.number(),
  weight: z.number(),
});

export const itemPropsSchema = itemSchema.omit({ id: true });

export type ItemSchema = z.infer<typeof itemSchema>;
export type ItemProps = z.infer<typeof itemPropsSchema>;
