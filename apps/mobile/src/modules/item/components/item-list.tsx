import { FlatList, Image, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import clsx from 'clsx';

export interface ItemListProps {
  inventory: any[] | undefined;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

export default function ItemList({
  inventory,
  selectedItem,
  setSelectedItem,
}: ItemListProps) {
  return (
    <View className="w-full border-t border-white/20 bg-black/60 backdrop-blur-sm lg:w-80 lg:border-l lg:border-t-0">
      <View
        className="w-full"
        style={{
          height: 260,
          overflow: 'hidden',
        }}
      >
        <FlatList
          data={inventory}
          keyExtractor={(item, idx) => `${item.id ?? idx}`}
          scrollEnabled
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingBottom: 120,
            overflow: 'scroll',
          }}
          renderItem={({ item: inventoryItem }) => {
            console.log('inventoryItem.item', inventoryItem.item);
            return (
              <Button
                onPress={() => setSelectedItem(inventoryItem)}
                className={clsx(
                  'flex-row items-center justify-between border-b border-white/10 p-2',
                  selectedItem.name === inventoryItem.item.name
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white',
                )}
              >
                <View className="flex-row items-center space-x-3">
                  <Image
                    source={{ uri: inventoryItem.item.image }}
                    className="h-6 w-6 rounded border border-white/10"
                    resizeMode="contain"
                  />
                  <Text className="ml-3 text-sm font-light">
                    {inventoryItem.item.name}
                  </Text>
                  <View className="ml-2 flex flex-row items-center gap-2">
                    {inventoryItem.item.equipped &&
                      inventoryItem.item.type !== 'weapon' && (
                        <Text className="rounded bg-white/20 px-1 py-0.5 text-xs">
                          E
                        </Text>
                      )}
                    {inventoryItem.item.onLeftHand && (
                      <Text className="rounded bg-white/20 px-1 py-0.5 text-xs">
                        L
                      </Text>
                    )}
                    {inventoryItem.item.onRightHand && (
                      <Text className="rounded bg-white/20 px-1 py-0.5 text-xs">
                        R
                      </Text>
                    )}
                  </View>
                </View>
                <Text className="text-right text-xs text-white">
                  {inventoryItem.amount}
                </Text>
              </Button>
            );
          }}
        />
      </View>
    </View>
  );
}
