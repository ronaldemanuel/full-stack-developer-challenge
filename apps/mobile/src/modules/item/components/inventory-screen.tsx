import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { useUser } from '@/modules/auth/hooks/use-user';
import { CharacterInfo } from '@/modules/character/character-info';
import ItemList from '@/modules/item/components/item-list';
import ItemStatsPanel from '@/modules/item/components/item-stats-panel';
import { SelectedItemCategory } from '@/modules/item/components/selected-item-category';
import { trpc } from '@/utils/api';
import { cn } from '@/utils/react-native-reusables';
import { useQuery } from '@tanstack/react-query';

import { InventoryEmptyPanel } from './inventory-empty-panel';

interface InventoryScreenProps {
  filter: 'weapon' | 'apparel' | 'misc' | 'all' | 'consumable';
}

export default function InventoryScreen({ filter }: InventoryScreenProps) {
  const itemQuery = useQuery(
    trpc.item.getUserItems.queryOptions({ type: filter }),
  );

  const { user } = useUser();

  const inventoryItems = itemQuery.data;

  const [selectedItem, setSelectedItem] = useState({
    amount: 0,
    item: {
      id: '',
      image: '',
      name: '',
      type: '',
    },
  });

  const filteredItems = useMemo(() => {
    if (!inventoryItems) return [];

    const result =
      filter === 'all'
        ? inventoryItems
        : inventoryItems.filter((inventory) => inventory.item.type === filter);

    return result;
  }, [inventoryItems, filter]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      setSelectedItem({ amount: 0, item: filteredItems[0].item });
    }
  }, [filteredItems]);

  const { width } = Dimensions.get('window');

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
        <Image
          source={require('../../../../assets/skyrim-logo.png')}
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
      <View className="flex flex-1 flex-row">
        <View className="relative z-10 flex flex-1 flex-col">
          {itemQuery.data?.length === 0 ? (
            <InventoryEmptyPanel user={user} />
          ) : (
            <View className="flex flex-1 flex-col lg:flex-row">
              <ItemStatsPanel
                inventoryItem={selectedItem}
                panelType="inventory"
              />

              <SelectedItemCategory selectedCategory={filter} />

              {/* Item list */}
              <ItemList
                inventory={filteredItems}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            </View>
          )}
        </View>
      </View>
      <CharacterInfo user={user} />
    </View>
  );
}
