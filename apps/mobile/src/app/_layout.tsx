import { Stack } from 'expo-router';
import { queryClient } from '@/utils/api';

import '../styles.css';

import { useUser } from '@/modules/auth/hooks/use-user';
import { QueryClientProvider } from '@tanstack/react-query';

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { loggedIn } = useUser();

  return (
    <QueryClientProvider client={queryClient}>
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens
        */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Protected guard={!!loggedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
