import type { Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { queryClient } from '@/utils/api';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

import '../styles.css';

import { useEffect } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { useUser } from '@/modules/auth/hooks/use-user';
import { NAV_THEME } from '@/utils/constants';
import { useColorScheme } from '@/utils/useColorScheme';
import { QueryClientProvider } from '@tanstack/react-query';

// This is the main layout of the app
// It wraps your pages with the providers they need

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

function RootLayout() {
  const { loggedIn } = useUser();

  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme('dark');
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!loggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!loggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function App() {
  return (
    <ThemeProvider value={DARK_THEME}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <RootLayout />
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
