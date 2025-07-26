import type { ApparelItemSchemaProps } from '../schemas/apparel.schema.js';
import type { ItemProps } from '../schemas/item.schema.js';

export const ITEMS = {
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
} satisfies Record<string, ItemProps | ApparelItemSchemaProps>;
