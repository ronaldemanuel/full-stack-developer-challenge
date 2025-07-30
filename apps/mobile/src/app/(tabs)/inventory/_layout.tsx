import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import InventoryScreen from './index';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <InventoryScreen />
    </SafeAreaView>
  );
}
