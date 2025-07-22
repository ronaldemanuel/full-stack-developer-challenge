import z from 'zod';

export const invitationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  email: z.string(),
  role: z.enum(['admin', 'member', 'owner']),
  status: z.enum(['pending', 'accepted', 'rejected', 'canceled']),
  inviterId: z.string(),
  expiresAt: z.date(),
});

export type Invitation = z.infer<typeof invitationSchema>;
