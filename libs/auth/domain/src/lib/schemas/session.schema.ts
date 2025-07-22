import { z } from 'zod';

import { userSchema } from '@nx-ddd/user-domain';

export const sessionSchema = z.object({
  session: z.object({
    id: z.string(),
    expiresAt: z.date(),
    token: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ipAddress: z.string().nullish(),
    userAgent: z.string().nullish(),
    userId: z.string(),
    activeOrganizationId: z.string().nullish(),
    impersonatedBy: z.string().nullish(),
  }),
  user: userSchema,
});

export type Session = z.infer<typeof sessionSchema>;
