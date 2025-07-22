import { z } from 'zod';

import { userSchema } from '@nx-ddd/user-domain';

export const memberSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  role: z.enum(['admin', 'member', 'owner']),
  createdAt: z.date(),
  userId: z.string(),
  user: userSchema.pick({ email: true, name: true, image: true }),
});

export type Member = z.infer<typeof memberSchema>;
