import z from 'zod';

export const itemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(255),
  image: z.string().url(),
  stackNumber: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const itemPropsSchema = itemSchema
  .omit({
    id: true,
  })
  .partial({
    createdAt: true,
    updatedAt: true,
  });

export type Item = z.infer<typeof itemSchema>;
export type ItemProps = z.infer<typeof itemPropsSchema>;
