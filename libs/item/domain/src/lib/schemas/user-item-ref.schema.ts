import z from 'zod';

import { userPropsSchema } from '@nx-ddd/user-domain';

export const userItemRefSchema = userPropsSchema.extend({
  equippedHelmet: z.string().nullish(),
  equippedBoots: z.string().nullish(),
  equippedChest: z.string().nullish(),
  equippedGloves: z.string().nullish(),
  leftHand: z.string().nullish(),
  rightHand: z.string().nullish(),
});

export const userItemRefPropsSchema = userItemRefSchema;

export type UserItemRefProps = z.infer<typeof userItemRefPropsSchema>;
