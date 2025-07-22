import z from 'zod';

import { invitationSchema } from './invitation.schema.js';
import { memberSchema } from './member.schema.js';
import { organizationSchema } from './organization.schema.js';

export const activeOrganizationSchema = organizationSchema.extend({
  members: z.array(memberSchema),
  invitations: z.array(invitationSchema),
});

export type ActiveOrganization = z.infer<typeof activeOrganizationSchema>;
