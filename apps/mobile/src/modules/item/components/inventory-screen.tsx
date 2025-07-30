import React, { useState } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Text } from '@/components/ui/text';
import ItemList from '@/modules/item/components/item-list';
import ItemStatsPanel from '@/modules/item/components/item-stats-panel';
import { SelectedItemCategory } from '@/modules/item/components/selected-item-category';
import clsx from 'clsx';

// Mock
const inventoryItems = Object.values({
  'dragonscale-helmet': {
    id: 'dragonscale-helmet' as const,
    name: 'Dragonscale Helmet',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 17,
    type: 'apparel',
    apparelType: 'helmet',
  },
  'dragonscale-gautlets': {
    id: 'dragonscale-gautlets' as const,
    name: 'Dragonscale Gautlets',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/6/60/Dragonscale_Gauntlets.png/revision/latest?cb=20170829115634',
    defenseValue: 12,
    type: 'apparel',
    apparelType: 'gloves',
  },
  'dragonscale-armor': {
    id: 'dragonscale-armor' as const,
    name: 'Dragonscale Armor',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/7/79/Dragonscale_Armor_%28Armor_Piece%29.png/revision/latest?cb=20170829115633',
    defenseValue: 41,
    type: 'apparel',
    apparelType: 'chest',
  },
  'dragonscale-boots': {
    id: 'dragonscale-boots' as const,
    name: 'Dragonscale Boots',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Boots.png/revision/latest?cb=20170829115634',
    defenseValue: 12,
    type: 'apparel',
    apparelType: 'boots',
  },
  'leather-helmet': {
    id: 'leather-helmet',
    name: 'Leather Helmet',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/2/29/Leather_Helmet_%28Skyrim%29.png/revision/latest?cb=20180219153937',
    defenseValue: 12,
    type: 'apparel',
    apparelType: 'helmet',
  },
  'leather-bracers': {
    id: 'leather-bracers',
    name: 'Leather Bracers',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/1/18/Leather_Bracers_%28Skyrim%29.png/revision/latest?cb=20180219152810',
    defenseValue: 7,
    type: 'apparel',
    apparelType: 'gloves',
  },
  'leather-armor': {
    id: 'leather-armor',
    name: 'Leather Armor',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/e/e2/Leather_Armor_%28Armor_Piece%29.png/revision/latest?cb=20180219152808',
    defenseValue: 26,
    type: 'apparel',
    apparelType: 'chest',
  },
  'leather-boots': {
    id: 'leather-boots',
    name: 'Leather Boots',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/e/e2/Leather_Armor_%28Armor_Piece%29.png/revision/latest?cb=20180219152808',
    defenseValue: 7,
    type: 'apparel',
    apparelType: 'boots',
  },
  'daedric-battleaxe': {
    id: 'daedric-battleaxe',
    name: 'Daedric Battleaxe',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/6/64/Daedricbattleaxe.png/revision/latest?cb=20120305203756',
    damageValue: 25,
    type: 'weapon',
    weaponType: 'two-hands',
  },
  'ebony-sword': {
    id: 'ebony-sword',
    name: 'Ebony Sword',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/d/d1/Ebonysword.png/revision/latest?cb=20120513000536',
    damageValue: 13,
    type: 'weapon',
    weaponType: 'one-hand',
  },
  'iron-sword': {
    id: 'iron-sword',
    name: 'Iron Sword',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/c/c7/Iron_Sword.png/revision/latest?cb=20121012152339',
    damageValue: 13,
    type: 'weapon',
    weaponType: 'one-hand',
  },
  'potion-of-health': {
    id: 'potion-of-health',
    name: 'Potion of Health',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/3/32/TESV_HealthPotion.png/revision/latest?cb=20131209201729',
    effectValue: 67,
    type: 'consumable',
    consumableType: 'hp-potion',
  },
  'potion-of-enhanced-stamina': {
    id: 'potion-of-enhanced-stamina',
    name: 'Potion of Enhanced Stamina',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/5/57/Potion_of_Enhanced_Stamina.png/revision/latest?cb=20131213191733',
    effectValue: 341,
    type: 'consumable',
    consumableType: 'sp-potion',
  },
  'potion-of-extra-magicka': {
    id: 'potion-of-extra-magicka',
    name: 'Potion of Extra Magicka',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/8/88/Potion_of_Extra_Magicka.png/revision/latest?cb=20131213190349',
    effectValue: 58,
    type: 'consumable',
    consumableType: 'mp-potion',
  },
});

interface InventoryScreenProps {
  filter: string;
}

export default function InventoryScreen({ filter }: InventoryScreenProps) {
  // const itemQuery = useQuery(trpc.item.getUserItems.queryOptions({}));

  // console.log(itemQuery.data);

  // const inventoryItems = itemQuery.data ?? [
  //   { id: '', image: '', name: '', type: '' },
  // ];

  const [selectedItem, setSelectedItem] = useState(inventoryItems[0]);

  const filteredItems =
    filter === 'all'
      ? inventoryItems
      : inventoryItems?.filter((item) => item.type === filter);

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
          className={clsx(
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
        {/* Main content */}
        <View className="relative z-10 flex flex-1 flex-col">
          {/* Desktop header */}
          {width >= 768 && (
            <View className="p-6 pb-0">
              <Text className="mt-2 text-3xl font-light tracking-wider text-white">
                INVENTORY
              </Text>
            </View>
          )}

          <View className="flex flex-1 flex-col lg:flex-row">
            {/* Large item display */}

            {/* Stats panel */}
            <ItemStatsPanel item={selectedItem} panelType="inventory" />

            <SelectedItemCategory selectedCategory={filter} />

            {/* Item list */}
            <ItemList
              items={filteredItems}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </View>
        </View>
      </View>

      {/* Carry weight bar */}
      {/* <View className="absolute inset-x-0 bottom-20 flex-row items-center justify-between border-t border-white/20 bg-black/90 p-3 backdrop-blur-sm">
        <View className="flex-row space-x-4 text-xs text-gray-400">
          <Text>E Equip</Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <Text className="text-xs text-gray-400">
            Carry Weight <Text className="text-white">245/350</Text>
          </Text>
          <View className="h-2 w-24 rounded bg-gray-700">
            <View
              className="h-2 rounded bg-green-500"
              style={{ width: '70%' }}
            />
          </View>
        </View>
      </View> */}
    </View>
  );
}
