import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import InventoryScreen from '@/components/inventory-screen';
import LoginScreen from '@/components/login-screen';
// import StoreScreen from '@/components/store-screen';
import { authClient } from '@/utils/auth';
import { useQueryClient } from '@tanstack/react-query';

export default function Index() {
  const queryClient = useQueryClient();

  const { data: session } = authClient.useSession();

  const [currentScreen, setCurrentScreen] = useState<
    'login' | 'store' | 'inventory'
  >('login');

  useEffect(() => {
    if (session) {
      setCurrentScreen('inventory');
    } else {
      setCurrentScreen('login');
    }
  }, [session]);

  const handleLogin = () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    await queryClient.invalidateQueries();
  };

  const handleNavigation = (screen: 'store' | 'inventory') => {
    setCurrentScreen(screen);
  };

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={() => {
          handleLogin();
        }}
      />
    );
  }

  // if (currentScreen === 'store') {
  //   return (
  //     <StoreScreen
  //       onNavigate={handleNavigation}
  //       onLogout={handleLogout}
  //       currentScreen={currentScreen}
  //     />
  //   );
  // }

  if (currentScreen === 'inventory') {
    return (
      <InventoryScreen
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        currentScreen={currentScreen}
      />
    );
  }

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Loading...' }} />
      <View className="p-4">
        <Text className="text-center text-xl">Loading...</Text>
      </View>
    </SafeAreaView>
  );
}
