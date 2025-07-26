import type { ApparelItemSchemaProps } from '../../../schemas/apparel.schema.js';
import type { UserItemRef } from '../../user-item.ref.js';
import { UserItemRefFactory } from '../../../entities/factories/user-item-ref.factory.js';
import { ItemMapper } from '../../../mappers/item.mapper.js';

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
  } as ApparelItemSchemaProps;

  beforeEach(() => {
    user = UserItemRefFactory({}, {}, 'user-123');
    helmet = ItemMapper.toDomain(baseItem, user);
  });

  it('should add a new item to the inventory if it does not exist yet', () => {
    user.addItemToInventory(helmet);

    expect(user.inventory).toHaveLength(1);
    expect(user.inventory[0].itemId).toBe('dragonscale-helmet');
    expect(user.inventory[0].amount).toBe(1);
    expect(user.inventory[0].character.id).toBe('user-123');
  });

  it('should increment the amount if the item already exists in the inventory', () => {
    user.addItemToInventory(helmet);
    user.addItemToInventory(helmet);

    expect(user.inventory).toHaveLength(1);
    expect(user.inventory[0].amount).toBe(2);
  });

  it('should keep other inventory items intact when adding a new item', () => {
    const otherItem = ItemMapper.toDomain(
      { ...baseItem, id: 'leather-helmet', name: 'Leather Helmet' },
      user,
    );

    user.addItemToInventory(otherItem);
    user.addItemToInventory(helmet);

    expect(user.inventory).toHaveLength(2);
    const ids = user.inventory.map((i) => i.itemId);
    expect(ids).toContain('leather-helmet');
    expect(ids).toContain('dragonscale-helmet');
  });
});
