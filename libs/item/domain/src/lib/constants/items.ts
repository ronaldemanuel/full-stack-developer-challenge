import type { ApparelItemSchemaProps } from '../schemas/apparel.schema';
import type { ConsumableItemProps } from '../schemas/consumable.schema';
import type { ItemSchema } from '../schemas/item.schema';
import type { WeaponItemProps } from '../schemas/weapon.schema';

export const ITEMS: Record<
  string,
  ItemSchema | ApparelItemSchemaProps | WeaponItemProps | ConsumableItemProps
> = {
  'dragonscale-helmet': {
    id: 'dragonscale-helmet' as const,
    name: 'Dragonscale Helmet',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 17,
    type: 'apparel',
    apparelType: 'helmet',
    price: 750,
    weight: 4,
  },
  'dragonscale-gautlets': {
    id: 'dragonscale-gautlets' as const,
    name: 'Dragonscale Gautlets',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/6/60/Dragonscale_Gauntlets.png/revision/latest?cb=20170829115634',
    defenseValue: 12,
    type: 'apparel',
    apparelType: 'gloves',
    price: 300,
    weight: 3,
  },
  'dragonscale-armor': {
    id: 'dragonscale-armor' as const,
    name: 'Dragonscale Armor',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/7/79/Dragonscale_Armor_%28Armor_Piece%29.png/revision/latest?cb=20170829115633',
    defenseValue: 41,
    type: 'apparel',
    apparelType: 'chest',
    price: 1500,
    weight: 300,
  },
  'dragonscale-boots': {
    id: 'dragonscale-boots' as const,
    name: 'Dragonscale Boots',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Boots.png/revision/latest?cb=20170829115634',
    defenseValue: 12,
    type: 'apparel',
    apparelType: 'boots',
    price: 300,
    weight: 3,
  },
  'leather-helmet': {
    id: 'leather-helmet',
    name: 'Leather Helmet',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/2/29/Leather_Helmet_%28Skyrim%29.png/revision/latest?cb=20180219153937',
    defenseValue: 12,
    type: 'apparel',
    apparelType: 'helmet',
    price: 60,
    weight: 2,
  },
  'leather-bracers': {
    id: 'leather-bracers',
    name: 'Leather Bracers',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/1/18/Leather_Bracers_%28Skyrim%29.png/revision/latest?cb=20180219152810',
    defenseValue: 7,
    type: 'apparel',
    apparelType: 'gloves',
    price: 25,
    weight: 2,
  },
  'leather-armor': {
    id: 'leather-armor',
    name: 'Leather Armor',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/e/e2/Leather_Armor_%28Armor_Piece%29.png/revision/latest?cb=20180219152808',
    defenseValue: 26,
    type: 'apparel',
    apparelType: 'chest',
    price: 125,
    weight: 3,
  },
  'leather-boots': {
    id: 'leather-boots',
    name: 'Leather Boots',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/6/65/Leather_Boots_%28Skyrim%29.png/revision/latest?cb=20180219153834',
    defenseValue: 7,
    type: 'apparel',
    apparelType: 'boots',
    price: 25,
    weight: 2,
  },
  'daedric-battleaxe': {
    id: 'daedric-battleaxe',
    name: 'Daedric Battleaxe',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/6/64/Daedricbattleaxe.png/revision/latest?cb=20120305203756',
    damageValue: 25,
    type: 'weapon',
    weaponType: 'two-hands',
    price: 2750,
    weight: 27,
  },
  'ebony-sword': {
    id: 'ebony-sword',
    name: 'Ebony Sword',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/d/d1/Ebonysword.png/revision/latest?cb=20120513000536',
    damageValue: 13,
    type: 'weapon',
    weaponType: 'one-hand',
    price: 720,
    weight: 15,
  },
  'iron-sword': {
    id: 'iron-sword',
    name: 'Iron Sword',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/c/c7/Iron_Sword.png/revision/latest?cb=20121012152339',
    damageValue: 13,
    type: 'weapon',
    weaponType: 'one-hand',
    price: 25,
    weight: 9,
  },
  'potion-of-health': {
    id: 'potion-of-health',
    name: 'Potion of Health',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/3/32/TESV_HealthPotion.png/revision/latest?cb=20131209201729',
    effectValue: 67,
    type: 'consumable',
    consumableType: 'hp-potion',
    price: 67,
    weight: 0,
  },
  'potion-of-enhanced-stamina': {
    id: 'potion-of-enhanced-stamina',
    name: 'Potion of Enhanced Stamina',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/5/57/Potion_of_Enhanced_Stamina.png/revision/latest?cb=20131213191733',
    effectValue: 341,
    type: 'consumable',
    consumableType: 'sp-potion',
    price: 44,
    weight: 0,
  },
  'potion-of-extra-magicka': {
    id: 'potion-of-extra-magicka',
    name: 'Potion of Extra Magicka',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/8/88/Potion_of_Extra_Magicka.png/revision/latest?cb=20131213190349',
    effectValue: 58,
    type: 'consumable',
    consumableType: 'mp-potion',
    price: 58,
    weight: 0,
  },
  'dragon-bone': {
    id: 'dragon-bone',
    name: 'Dragon Bone',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/a/ad/TESV_Dragon_Bone.png/revision/latest?cb=20120316215755',
    type: 'misc',
    price: 500,
    weight: 15,
  },
  'silver-ingot': {
    id: 'silver-ingot',
    name: 'Silver Ingot',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/f9/Ingotsilver.png/revision/latest?cb=20120612172836',
    type: 'misc',
    price: 50,
    weight: 1,
  },
  'diamond': {
    id: 'diamond',
    name: 'Diamond',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/d/d5/Skyrim_diamond.png/revision/latest?cb=20120901164151',
    type: 'misc',
    price: 800,
    weight: 0.1,
  },
  'coin': {
    id: 'coin',
    name: 'Coin',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/5/55/Septim_Skyrim.png/revision/latest?cb=20120311100037',
    type: 'misc',
    price: 0,
    weight: 0.1,
  },
  'potion-of-minor-stamina': {
    id: 'potion-of-minor-stamina',
    name: 'Potion of Minor Stamina',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/4/48/Potion_of_Minor_Stamina.png/revision/latest?cb=20131216184139',
    type: 'consumable',
    price: 20,
    weight: 0,
    consumableType: 'sp-potion',
    effectValue: 25,
  },
  'trollsbane': {
    id: 'trollsbane',
    name: 'Trollsbane',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/1/1a/SteelWarhammer_SK.png/revision/latest?cb=20121012192841',
    type: 'weapon',
    price: 60,
    weight: 25,
    weaponType: 'two-hands',
    damageValue: 20,
  },
} satisfies Record<
  string,
  ItemSchema | ApparelItemSchemaProps | WeaponItemProps | ConsumableItemProps
>;
