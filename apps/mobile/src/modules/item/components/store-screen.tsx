import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useUser } from '@/modules/auth/hooks/use-user';
import { MoneyInfo } from '@/modules/character/money-info';
import ItemList from '@/modules/item/components/item-list';
import ItemStatsPanel from '@/modules/item/components/item-stats-panel';
import { SelectedItemCategory } from '@/modules/item/components/selected-item-category';
import { trpc } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

interface StoreScreenProps {
  filter: 'weapon' | 'apparel' | 'misc' | 'all' | 'consumable';
}

export default function StoreScreen({ filter }: StoreScreenProps) {
  const { data: items } = useQuery(
    trpc.item.getAllItems.queryOptions({ type: filter }),
  );
  const { user } = useUser();

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
    if (!items) return [];

    const filtered =
      filter === 'all' ? items : items.filter((item) => item.type === filter);

    return filtered.map((item) => ({ item }));
  }, [items, filter]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      setSelectedItem({ amount: 0, item: filteredItems[0].item });
    }
  }, [filteredItems]);

  return (
    <View className="flex-1 flex-row">
      {/* Main Content */}
      <View className="relative z-10 flex flex-1 flex-col">
        {/* Desktop Header */}
        <View className="hidden p-6 pb-0 md:block">
          <Text className="mb-2 text-3xl font-light tracking-wider text-white">
            GENERAL GOODS
          </Text>
          <Text className="text-gray-400">Belethor's General Goods</Text>
        </View>

        <View className="flex flex-1 flex-col lg:flex-row">
          {/* Item Display */}
          <ItemStatsPanel inventoryItem={selectedItem} panelType="store" />

          <SelectedItemCategory selectedCategory={filter} />

          {/* Item List */}
          <ItemList
            inventory={filteredItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </View>
        <MoneyInfo user={user} />
      </View>
    </View>
  );
}
