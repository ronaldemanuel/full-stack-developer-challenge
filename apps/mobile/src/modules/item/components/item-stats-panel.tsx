import { Image, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useToast } from '@/components/ui/toast';
import { trpc } from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface ItemStatsPanelProps {
  inventoryItem: any;
  panelType: 'inventory' | 'store';
}

export default function ItemStatsPanel({
  inventoryItem,
  panelType,
}: ItemStatsPanelProps) {
  const queryClient = useQueryClient();

  const toast = useToast();

  const { mutate, error } = useMutation(
    trpc.item.addItemToInventory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.item.getUserItems.queryFilter(),
        );
        toast.toast({
          title: 'Success',
          description: 'Item added',
          variant: 'success',
        });
      },
    }),
  );

  return (
    <View className="mt-3 flex-1 items-center justify-center p-4">
      <View className="mb-6 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-white/30 bg-gradient-to-b from-gray-600 to-gray-800 shadow-2xl md:h-48 md:w-48 lg:h-64 lg:w-64">
        <Image
          source={{ uri: inventoryItem.item.image }}
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
              {inventoryItem.item.name.toUpperCase()}
            </Text>
            <Text className="text-center text-sm text-gray-400">
              {inventoryItem.item.type}
            </Text>
          </View>

          {/* ATTRIBUTES */}
          <View className="mb-4 flex flex-row flex-wrap items-center justify-center gap-4">
            {inventoryItem.item.type === 'weapon' && (
              <View className="items-center">
                <Text className="text-xs uppercase text-gray-400">Damage</Text>
                <Text className="text-lg font-light text-white">
                  {/* {item.damageValue} */}
                  {inventoryItem.item.damageValue}
                </Text>
              </View>
            )}

            {inventoryItem.item.type === 'apparel' && (
              <View className="items-center">
                <Text className="text-xs uppercase text-gray-400">Armor</Text>
                <Text className="text-lg font-light text-white">
                  {inventoryItem.item.defenseValue}
                </Text>
              </View>
            )}

            {inventoryItem.item.type === 'consumable' && (
              <View className="items-center">
                <Text className="text-xs uppercase text-gray-400">Effect</Text>
                <Text className="text-lg font-light text-white">
                  {inventoryItem.item.effectValue}
                </Text>
              </View>
            )}

            <View className="items-center">
              <Text className="text-xs uppercase text-gray-400">Weight</Text>
              <Text className="text-lg font-light text-white">
                {inventoryItem.item.weight}
              </Text>
            </View>

            <View className="items-center">
              <Text className="text-xs uppercase text-gray-400">Price</Text>
              <Text className="text-lg font-light text-white">
                {inventoryItem.item.price}
              </Text>
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
                  {inventoryItem.item.type === 'consumable' ||
                  inventoryItem.item.type === 'misc'
                    ? 'Use'
                    : inventoryItem.item.equipped
                      ? 'Unequip'
                      : 'Equip'}
                </Text>
              </Button>
            )}
            {panelType === 'store' && (
              <Button
                onPress={() => {
                  console.log('Comprar Item');
                  mutate({ itemId: inventoryItem.item.id });
                }}
                className="rounded bg-white/20 px-4 py-2"
              >
                <View className="flex-row items-center gap-1">
                  <Text className="mr-1 text-white">BUY</Text>
                  <Text className="mr-1 text-white">
                    {inventoryItem.item.price}
                  </Text>
                  <Image
                    source={require('../../../../assets/Septim_Skyrim.png')}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </View>
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
