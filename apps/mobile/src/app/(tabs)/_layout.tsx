import { Tabs } from 'expo-router/tabs';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { LogOut } from '@/lib/icons/LogOut';
import { Package } from '@/lib/icons/Package';
import { Store } from '@/lib/icons/Store';
import { handleLogout } from '@/modules/auth/hooks/use-auth';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="inventory/index"
        options={{
          title: 'INVENTORY',
          tabBarIcon: (props) => <Package {...props} />,
        }}
      />
      <Tabs.Screen
        name="store/index"
        options={{
          title: 'STORE',
          tabBarIcon: (props) => <Store {...props} />,
        }}
      />

      <Tabs.Screen
        name="logout"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
        options={{
          title: 'LOGOUT',
          tabBarIcon: (props) => <LogOut {...props} color="#f87171" />,
          tabBarLabelStyle: { color: '#f87171' },
        }}
      />
    </Tabs>
  );
}
