import { FlatList, Image, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import clsx from 'clsx';

export interface ItemListProps {
  items: any[];
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

export default function ItemList({
  items,
  selectedItem,
  setSelectedItem,
}: ItemListProps) {
  return (
    <View className="w-full border-t border-white/20 bg-black/60 backdrop-blur-sm lg:w-80 lg:border-l lg:border-t-0">
      <View
        className="w-full"
        style={{
          height: 360,
          overflow: 'hidden',
        }}
      >
        <FlatList
          data={items}
          keyExtractor={(item, idx) => `${item.id ?? idx}`}
          scrollEnabled
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingBottom: 120,
            overflow: 'scroll',
          }}
          renderItem={({ item }) => (
            <Button
              onPress={() => setSelectedItem(item)}
              className={clsx(
                'flex-row items-center justify-between border-b border-white/10 p-2',
                selectedItem.name === item.name
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white',
              )}
            >
              <View className="flex-row items-center space-x-3">
                <Image
                  source={{ uri: item.image }}
                  className="h-6 w-6 rounded border border-white/10"
                  resizeMode="contain"
                />
                <Text className="text-sm font-light">{item.name}</Text>
              </View>
              <Text className="text-right text-xs text-white">100</Text>
            </Button>
          )}
        />
      </View>
    </View>
  );
}
