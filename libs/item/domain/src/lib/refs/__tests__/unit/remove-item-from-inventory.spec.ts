import type { ApparelItemSchemaProps } from '../../../schemas/apparel.schema.js';
import type { UserItemRef } from '../../user-item.ref.js';
import { UserItemRefFactory } from '../../../entities/factories/user-item-ref.factory.js';
import { ItemMapper } from '../../../mappers/item.mapper.js';

describe('UserItemRef - removeItemFromInventory', () => {
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

  it('should remove an existing item from inventory', () => {
    user.addItemToInventory(helmet);
    user.removeItemFromInventory(helmet.id);

    expect(
      user.inventory.find((item) => item.itemId === helmet.id),
    ).toBeUndefined();
    expect(user.inventory).toHaveLength(0);
  });

  it('should throw NotFoundError if item does not exist in inventory', () => {
    user.addItemToInventory(helmet);

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
    } as ApparelItemSchemaProps;

    const gloves = ItemMapper.toDomain(item2, user);

    user.addItemToInventory(helmet);
    user.addItemToInventory(gloves);

    user.removeItemFromInventory(helmet.id);

    expect(user.inventory.map((i: any) => i.itemId)).toEqual([gloves.id]);
  });
});
