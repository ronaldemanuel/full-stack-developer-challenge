import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    magicLinkClient(),
    multiSessionClient(),
    adminClient(),
  ],
});
