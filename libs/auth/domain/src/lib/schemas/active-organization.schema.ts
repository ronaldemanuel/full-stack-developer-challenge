import z from 'zod';

import { invitationSchema } from './invitation.schema';
import { memberSchema } from './member.schema';
import { organizationSchema } from './organization.schema';

export const activeOrganizationSchema = organizationSchema.extend({
  members: z.array(memberSchema),
  invitations: z.array(invitationSchema),
});

export type ActiveOrganization = z.infer<typeof activeOrganizationSchema>;
