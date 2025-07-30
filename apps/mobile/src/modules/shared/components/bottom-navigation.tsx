import { TouchableOpacity, View } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Text } from '@/components/ui/text';
import { handleLogout } from '@/modules/auth/hooks/use-auth';
import clsx from 'clsx';
import { LogOut, Package, Store } from 'lucide-react-native';

export default function BottomNavigation() {
  const currentScreen = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/20 bg-black/100 backdrop-blur-sm">
      <View className="flex flex-row items-center justify-around px-4 py-4">
        {/* Inventory */}
        <Link href={'/(tabs)/inventory'}>
          <TouchableOpacity
            className={clsx(
              'flex flex-col items-center space-y-1 rounded-lg px-4 py-2 transition-all duration-200',
              currentScreen === 'inventory'
                ? 'border border-white/30 bg-white/20 text-white'
                : 'text-gray-400',
            )}
          >
            <Package
              color={currentScreen === 'inventory' ? 'white' : '#9ca3af'}
              size={24}
            />
            <Text
              className={clsx(
                'text-xs font-light tracking-wider',
                currentScreen === 'inventory' ? 'text-white' : 'text-gray-400',
              )}
            >
              INVENTORY
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Store */}
        <Link href={'/(tabs)/store'}>
          <TouchableOpacity
            className={clsx(
              'flex flex-col items-center space-y-1 rounded-lg px-4 py-2 transition-all duration-200',
              currentScreen === 'store'
                ? 'border border-white/30 bg-white/20 text-white'
                : 'text-gray-400',
            )}
          >
            <Store
              color={currentScreen === 'store' ? 'white' : '#9ca3af'}
              size={24}
            />
            <Text
              className={clsx(
                'text-xs font-light tracking-wider',
                currentScreen === 'store' ? 'text-white' : 'text-gray-400',
              )}
            >
              STORE
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex flex-col items-center space-y-1 rounded-lg px-4 py-2 transition-all duration-200"
        >
          <LogOut color="#f87171" size={24} />
          <Text className="text-xs font-light tracking-wider text-red-400">
            LOGOUT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
