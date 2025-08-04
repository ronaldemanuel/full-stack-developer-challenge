import { Image, ScrollView, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import SkyrimButton from '@/modules/shared/components/skyrim-button';
import { cn } from '@/utils/react-native-reusables';

interface InventoryEmptyPanelProps {
  user: any;
}

export function InventoryEmptyPanel({ user }: InventoryEmptyPanelProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="mb-6 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-white/30 bg-gradient-to-b from-gray-600 to-gray-800 shadow-2xl md:h-48 md:w-48 lg:h-64 lg:w-64"></View>
      <View className="w-full max-w-md border-2 border-white/30 bg-black/80 p-4 backdrop-blur-sm">
        <View className="relative items-center">
          {/* DEATILS */}
          <View className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-white/50" />
          <View className="absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-white/50" />
          <View className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-white/50" />
          <View className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-white/50" />

          {/* TITLE */}
          <View className="items-center p-2">
            <View className="mb-6">
              <Text className="mb-4 text-xl font-light tracking-wider text-white">
                YOUR JOURNEY BEGINS
              </Text>
              <Text className="mb-6 text-sm leading-relaxed text-gray-400">
                Your inventory is empty, {(user.name as string).toUpperCase()}.
                Every great adventure starts with a single step.
              </Text>
            </View>
          </View>

          {/* BUTTON */}
          <View className="items-center border-t border-white/20 pt-4">
            <Link href={'/(tabs)/store'}>
              <SkyrimButton
                onPress={() => {
                  router.replace('/(tabs)/store');
                }}
                className="w-full py-3 text-lg"
              >
                VISIT GENERAL STORE
              </SkyrimButton>
            </Link>
            <Text className="mt-2 text-center text-xs text-gray-500">
              Start your adventure by acquiring essential gear
            </Text>
          </View>
        </View>
      </View>

      <View className="w-full border-t border-white/20 bg-black/60 backdrop-blur-sm lg:w-80 lg:border-l lg:border-t-0">
        <View
          className="w-full"
          style={{
            height: 260,
            overflow: 'hidden',
          }}
        >
          <View className="mt-3 p-4">
            <View className="mb-4">
              <Text className="mb-2 text-lg font-light tracking-wider text-white">
                ITEMS
              </Text>
              <Text className="text-sm text-gray-500">No items found</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
