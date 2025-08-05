import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema';
import type { HelmetEntity } from '../../../apparel/helmet.entity';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('HelmetEntity', () => {
  let character: UserItemRef;
  let helmet: HelmetEntity;

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-helmet',
    name: 'Dragon Helmet',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 31,
    apparelType: 'helmet',
    price: 750,
    weight: 4,
  } as HelmetEntity;

  beforeEach(() => {
    character = UserItemRefFactory({}, {}, 'user-123');
    helmet = ItemMapper.toDomain(baseItem, character) as HelmetEntity;
  });

  it('should equip the helmet if no helmet is currently equipped', () => {
    helmet.use();

    expect(character.equippedHelmet).toBe(helmet.id);
  });

  it('should replace the currently equipped helmet with a new one', () => {
    const newHelmetProps: ApparelItemSchemaProps = {
      id: 'leather-helmet',
      name: 'Leather Helmet',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/2/29/Leather_Helmet_%28Skyrim%29.png/revision/latest?cb=20180219153937',
      defenseValue: 12,
      type: 'apparel',
      apparelType: 'helmet',
      price: 60,
      weight: 2,
    } as ApparelItemSchemaProps;

    // Equip the first helmet
    helmet.use();
    expect(character.equippedHelmet).toBe(helmet.id);

    // Equip a different helmet

    const newHelmet = ItemMapper.toDomain(newHelmetProps, character);
    newHelmet.use();
    expect(character.equippedHelmet).toBe(newHelmet.id);
  });

  it('should unequip the helmet if it is already equipped', () => {
    // Equip
    helmet.use();
    expect(character.equippedHelmet).toBe(helmet.id);

    // Unequip
    helmet.use();
    expect(character.equippedHelmet).toBeNull();
  });

  it('should return true for equipped if the helmet is the one equipped', () => {
    helmet.use();

    expect(helmet.equipped).toBe(true);
  });
});
