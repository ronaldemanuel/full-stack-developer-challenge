import type { categories } from '@/modules/shared/constants/item-categories';
import { Image, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import SkyrimButton from '@/modules/shared/components/skyrim-button';

export interface ItemStatsPanelProps {
  item: any;
  panelType: 'inventory' | 'store';
}

export default function ItemStatsPanel({
  item,
  panelType,
}: ItemStatsPanelProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="mb-6 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-white/30 bg-gradient-to-b from-gray-600 to-gray-800 shadow-2xl md:h-48 md:w-48 lg:h-64 lg:w-64">
        <Image
          source={{ uri: item.image }}
          className="h-full w-full rounded border border-white/10"
          resizeMode="contain"
        />
      </View>
      <View className="w-full max-w-md border-2 border-white/30 bg-black/80 p-4 backdrop-blur-sm">
        <View className="relative items-center">
          {/* DEATILS */}
          <View className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-white/50" />
          <View className="absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-white/50" />
          <View className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-white/50" />
          <View className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-white/50" />

          {/* TITLE */}
          <View className="mb-4 items-center">
            <Text className="mb-2 text-center text-xl font-light tracking-wider text-white">
              {item.name.toUpperCase()}
            </Text>
            <Text className="text-center text-sm text-gray-400">
              {item.type}
            </Text>
          </View>

          {/* ATTRIBUTES */}
          <View className="mb-4 flex flex-row flex-wrap items-center justify-center gap-4">
            {item.type === 'weapon' && (
              <View className="items-center">
                <Text className="text-xs uppercase text-gray-400">Damage</Text>
                <Text className="text-lg font-light text-white">
                  {/* {item.damageValue} */}
                  10
                </Text>
              </View>
            )}

            {item.type === 'apparel' && (
              <View className="items-center">
                <Text className="text-xs uppercase text-gray-400">Armor</Text>
                <Text className="text-lg font-light text-white">
                  {/* {item.defenseValue} */}
                  10
                </Text>
              </View>
            )}

            {item.type === 'consumable' && (
              <View className="items-center">
                <Text className="text-xs uppercase text-gray-400">Effect</Text>
                <Text className="text-lg font-light text-white">
                  {/* {item.effectValue} */}
                  10
                </Text>
              </View>
            )}

            <View className="items-center">
              <Text className="text-xs uppercase text-gray-400">Weight</Text>
              <Text className="text-lg font-light text-white">10</Text>
            </View>

            <View className="items-center">
              <Text className="text-xs uppercase text-gray-400">Value</Text>
              <Text className="text-lg font-light text-white">10</Text>
            </View>
          </View>

          {/* BUTTON */}
          <View className="items-center border-t border-white/20 pt-4">
            {panelType === 'inventory' && (
              <Button
                onPress={() => {
                  console.log('Usar Item');
                }}
                className="rounded bg-white/20 px-4 py-2"
              >
                <Text className="text-white">
                  {item.type === 'consumable' || item.type === 'misc'
                    ? 'Use'
                    : 'Equip'}
                </Text>
              </Button>
            )}
            {panelType === 'store' && (
              <Button
                onPress={() => {
                  console.log('Comprar Item');
                }}
                className="rounded bg-white/20 px-4 py-2"
              >
                <Text className="text-white">BUY 50 GOLD</Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
