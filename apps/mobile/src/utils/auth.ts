import * as SecureStore from 'expo-secure-store';
import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';

import { getBaseUrl } from './base-url';

type AuthClient = ReturnType<
  typeof createAuthClient<{
    plugins: [ReturnType<typeof expoClient>];
  }>
>;

export const authClient: AuthClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    expoClient({
      scheme: 'expo',
      storagePrefix: 'expo',
      storage: SecureStore,
    }),
  ],
});
