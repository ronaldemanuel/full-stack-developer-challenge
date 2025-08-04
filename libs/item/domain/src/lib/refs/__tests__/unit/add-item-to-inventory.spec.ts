import type { MiscItemEntity } from '../../../entities/misc.entity';
import type { ApparelItemSchemaProps } from '../../../schemas/apparel.schema';
import type { UserItemRef } from '../../user-item.ref';
import { UserItemRefFactory } from '../../../entities/factories/user-item-ref.factory';
import { InventoryItemMapper } from '../../../mappers';
import { ItemMapper } from '../../../mappers/item.mapper';

describe('UserItemRef.addItemToInventory', () => {
  let user: UserItemRef;
  let helmet: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-helmet',
    name: 'Dragon Helmet',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 31,
    apparelType: 'helmet',
    price: 123,
    weight: 4,
  } as ApparelItemSchemaProps;

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
  const inventoryItem = InventoryItemMapper.toDomain(
    { amount: 1000 },
    { item: coin },
  );

  beforeEach(() => {
    user = UserItemRefFactory({}, { inventory: [inventoryItem] }, 'user-123');
    helmet = ItemMapper.toDomain(baseItem, user);
  });

  it('should add a new item to the inventory if it does not exist yet', () => {
    user.addItemToInventory(helmet);

    const testInventoryItem = user.inventory.find((i) => i.item.id !== 'coin');

    expect(user.inventory).toHaveLength(2);
    expect(testInventoryItem?.itemId).toBe('dragonscale-helmet');
    expect(testInventoryItem?.amount).toBe(1);
    expect(testInventoryItem?.character.id).toBe('user-123');
  });

  it('should increment the amount if the item already exists in the inventory', () => {
    user.addItemToInventory(helmet);
    user.addItemToInventory(helmet);

    const testInventoryItem = user.inventory.find((i) => i.item.id !== 'coin');

    expect(user.inventory).toHaveLength(2);
    expect(testInventoryItem?.amount).toBe(2);
  });

  it('should keep other inventory items intact when adding a new item', () => {
    const otherItem = ItemMapper.toDomain(
      { ...baseItem, id: 'leather-helmet', name: 'Leather Helmet' },
      user,
    );

    user.addItemToInventory(otherItem);
    user.addItemToInventory(helmet);

    expect(user.inventory).toHaveLength(3);
    const ids = user.inventory.map((i) => i.itemId);
    expect(ids).toContain('leather-helmet');
    expect(ids).toContain('dragonscale-helmet');
  });
});
