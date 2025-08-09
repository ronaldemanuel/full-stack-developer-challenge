import { Dimensions, ImageBackground, View } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import { LogOut } from '@/lib/icons/LogOut';
import { Package } from '@/lib/icons/Package';
import { Store } from '@/lib/icons/Store';
import { UserRoundPen } from '@/lib/icons/UserRoundPen';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { cn } from '@/utils/react-native-reusables';

const width = Dimensions.get('window').width;

export default function TabLayout() {
  const { logout } = useAuth();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      screenLayout={({ children }) => {
        return (
          <View className="relative flex-1 bg-black">
            {/* Background gradients */}
            <View className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black" />
            <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

            {/* Dragon logo */}
            <View
              pointerEvents="none"
              className="absolute inset-0 z-0 items-center justify-center opacity-5"
            >
              <ImageBackground
                source={require('../../../assets/skyrim-logo.png')}
                className={cn(
                  width > 1024
                    ? 'h-[700px] w-[700px]'
                    : width > 768
                      ? 'h-[600px] w-[600px]'
                      : 'h-[384px] w-[384px]',
                )}
                resizeMode="contain"
              />
            </View>
            {children}
          </View>
        );
      }}
    >
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'INVENTORY',
          tabBarIcon: (props) => <Package {...props} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'STORE',
          tabBarIcon: (props) => <Store {...props} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: (props) => <UserRoundPen {...props} />,
        }}
      />

      <Tabs.Screen
        name="logout"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            logout();
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
