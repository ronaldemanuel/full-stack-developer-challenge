import z from 'zod';

import { userPropsSchema } from '@nx-ddd/user-domain';

export const userItemRefSchema = userPropsSchema.extend({
  equippedHelmet: z.nullable(z.any()),
  equippedChest: z.nullable(z.any()),
  equippedBoots: z.nullable(z.any()),
  equippedGloves: z.nullable(z.any()),
  leftHand: z.nullable(z.any()),
  rightHand: z.nullable(z.any()),
});

export const userItemRefPropsSchema = userItemRefSchema;

export type UserItemRef = z.infer<typeof userItemRefSchema>;
export type UserItemRefProps = z.infer<typeof userItemRefPropsSchema>;
