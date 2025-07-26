import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  twoFactorEnabled: z.boolean().nullish(),
  role: z.string().nullish(),
  banned: z.boolean().nullish(),
  banReason: z.string().nullish(),
  banExpires: z.date().nullish(),
  hpLevel: z.number().max(500).int().default(100),
  spLevel: z.number().max(2000).int().default(1000),
  mpLevel: z.number().max(200).int().default(50),
});

export const userPropsSchema = userSchema
  .omit({
    id: true,
  })
  .partial({
    createdAt: true,
    updatedAt: true,
  });

export type User = z.infer<typeof userSchema>;
export type UserProps = z.infer<typeof userPropsSchema>;
