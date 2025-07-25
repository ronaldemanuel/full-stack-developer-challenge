import z from 'zod';

export const userItemRefSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  equippedHelmet: z.nullable(z.any()),
  equippedChest: z.nullable(z.any()),
  equippedBoots: z.nullable(z.any()),
  equippedGloves: z.nullable(z.any()),
  leftHand: z.nullable(z.any()),
  rightHand: z.nullable(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
  hpLevel: z.number().int().default(100),
  spLevel: z.number().int().default(100),
  mpLevel: z.number().int().default(50),
});

export const userItemRefPropsSchema = userItemRefSchema
  .omit({
    id: true,
  })
  .partial({
    createdAt: true,
    updatedAt: true,
  });

export type UserItemRef = z.infer<typeof userItemRefSchema>;
export type UserItemRefProps = z.infer<typeof userItemRefPropsSchema>;
