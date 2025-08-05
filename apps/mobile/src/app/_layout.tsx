import type { Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { queryClient, trpc } from '@/utils/api';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

import '../styles.css';

import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { ToastProvider } from '@/components/ui/toast';
import { useUser } from '@/modules/auth/hooks/use-user';
import { NAV_THEME } from '@/utils/constants';
import { useColorScheme } from '@/utils/useColorScheme';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';

// This is the main layout of the app
// It wraps your pages with the providers they need

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { loggedIn, isFetching } = useUser();
  const [appReady, setAppReady] = useState(false);
  const queryClient = useQueryClient();

  const { setColorScheme } = useColorScheme();

  const preFetchData = useCallback(async () => {
    const { queryKey, queryFn } = trpc.item.getUserItems.queryOptions({
      type: 'all',
    });

    await queryClient.prefetchQuery({ queryKey, queryFn });

    await SplashScreen.hideAsync().then(() => {
      setAppReady(true);
    });
  }, [queryClient]);

  useEffect(() => {
    if (!isFetching) {
      preFetchData();
    }
  }, [isFetching, preFetchData]);

  useEffect(() => {
    setColorScheme('dark');
  }, [setColorScheme]);

  if (!appReady) return null;

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
