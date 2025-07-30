import { Redirect } from 'expo-router';
import { useUser } from '@/modules/auth/hooks/use-user';

import LoginScreen from './(auth)';
import InventoryScreen from './(tabs)/inventory';

export default function Index() {
  const { loggedIn } = useUser();

  console.log(loggedIn);

  if (loggedIn === undefined) return null;

  return loggedIn ? <InventoryScreen /> : <LoginScreen />;
}
