import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  twoFactorEnabled: z.boolean().nullish(),
  role: z.string().nullish(),
  banned: z.boolean().nullish(),
  banReason: z.string().nullish(),
  banExpires: z.date().nullish(),
});

export const userPropsSchema = userSchema
  .omit({
    id: true,
  })
  .partial({
    createdAt: true,
    updatedAt: true,
  });

export type UserProps = z.infer<typeof userPropsSchema>;

export type User = z.infer<typeof userSchema>;
