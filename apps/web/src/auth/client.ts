import {
  adminClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/two-factor';
      },
    }),
    passkeyClient(),
    magicLinkClient(),
    multiSessionClient(),
    // oneTapClient({
    //   clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    //   promptOptions: {
    //     maxAttempts: 1,
    //   },
    // }),
    adminClient(),
  ],
});
