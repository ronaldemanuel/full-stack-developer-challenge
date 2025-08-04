import type { MiscItemEntity } from '../../../entities/misc.entity';
import type { ApparelItemSchemaProps } from '../../../schemas/apparel.schema';
import type { UserItemRef } from '../../user-item.ref';
import { UserItemRefFactory } from '../../../entities/factories/user-item-ref.factory';
import { InventoryItemMapper } from '../../../mappers';
import { ItemMapper } from '../../../mappers/item.mapper';

describe('UserItemRef - removeItemFromInventory', () => {
  let user: UserItemRef;
  let helmet: ReturnType<typeof ItemMapper.toDomain>;
  let helmetItemEntity: ReturnType<typeof InventoryItemMapper.toDomain>;

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-helmet',
    name: 'Dragon Helmet',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 31,
    apparelType: 'helmet',
    price: 23,
    weight: 3,
  } as ApparelItemSchemaProps;

  beforeEach(() => {
    helmet = ItemMapper.toDomain(baseItem);
    helmetItemEntity = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: helmet },
    );
    user = UserItemRefFactory(
      {},
      { inventory: [helmetItemEntity] },
      'user-123',
    );
  });

  it('should decrease the amount value if it is greater then 1', () => {
    const coinProps = {
      id: 'coin',
      name: 'Coin',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/5/55/Septim_Skyrim.png/revision/latest?cb=20120311100037',
      type: 'misc',
      price: 0,
      weight: 0.1,
    } as MiscItemEntity;

    const coin = ItemMapper.toDomain(coinProps);

    const inventoryItem1 = InventoryItemMapper.toDomain(
      { amount: 1000 },
      { item: coin },
    );

    user.$watchedRelations.inventory.add(inventoryItem1);

    user.removeItemFromInventory(coin.id);

    expect(user.inventory).toHaveLength(2);
    expect(user.inventory[1].amount === 999);
    expect(
      user.inventory.find((item) => item.itemId === coin.id),
    ).toBeDefined();
  });

  it('should decrease the amount value if the amount is passed to the function', () => {
    const coinProps = {
      id: 'coin',
      name: 'Coin',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/5/55/Septim_Skyrim.png/revision/latest?cb=20120311100037',
      type: 'misc',
      price: 0,
      weight: 0.1,
    } as MiscItemEntity;

    const coin = ItemMapper.toDomain(coinProps);

    const inventoryItem1 = InventoryItemMapper.toDomain(
      { amount: 1000 },
      { item: coin },
    );

    user.$watchedRelations.inventory.add(inventoryItem1);

    user.removeItemFromInventory(coin.id, 100);

    expect(user.inventory).toHaveLength(2);
    expect(user.inventory[1].amount === 900);
    expect(
      user.inventory.find((item) => item.itemId === coin.id),
    ).toBeDefined();
  });

  it('should remove an existing item from inventory', () => {
    user.removeItemFromInventory(helmet.id);

    expect(user.inventory).toHaveLength(0);
    expect(
      user.inventory.find((item) => item.itemId === helmet.id),
    ).toBeUndefined();
  });

  it('should throw NotFoundError if item does not exist in inventory', () => {
    expect(() => {
      user.removeItemFromInventory('non-existent-id');
    }).toThrow('Item not found in user inventory');
  });

  it('should remove only the matching item and keep the rest', () => {
    const item2: ApparelItemSchemaProps = {
      id: 'dragonscale-gautlets',
      name: 'Dragon Gautlets',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
      defenseValue: 12,
      apparelType: 'gloves',
      price: 34,
      weight: 5,
    } as ApparelItemSchemaProps;

    const gloves = ItemMapper.toDomain(item2, user);

    const coinProps = {
      id: 'coin',
      name: 'Coin',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/5/55/Septim_Skyrim.png/revision/latest?cb=20120311100037',
      type: 'misc',
      price: 0,
      weight: 0.1,
    } as MiscItemEntity;

    const coin = ItemMapper.toDomain(coinProps);

    const inventoryItem1 = InventoryItemMapper.toDomain(
      { amount: 1000 },
      { item: coin },
    );

    const inventoryItem2 = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: gloves },
    );

    user.$watchedRelations.inventory.add(inventoryItem1);
    user.$watchedRelations.inventory.add(inventoryItem2);

    user.removeItemFromInventory(helmet.id);

    expect(user.inventory.map((i: any) => i.itemId)).toEqual([
      'coin',
      gloves.id,
    ]);
  });
});
