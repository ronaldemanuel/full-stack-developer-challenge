import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('GlovesEntity', () => {
  let character: UserItemRef;
  let gloves: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-gautlets',
    name: 'Dragon Helmet',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 31,
    apparelType: 'gloves',
    price: 750,
    weight: 4,
  } as ApparelItemSchemaProps;

  beforeEach(() => {
    character = UserItemRefFactory({}, {}, 'user-123');
    gloves = ItemMapper.toDomain(baseItem, character);
  });

  it('should equip the gloves if no gloves is currently equipped', () => {
    gloves.use();

    expect(character.equippedGloves).toBe(gloves);
  });

  it('should replace the currently equipped gloves with a new one', () => {
    const newGlovesProps: ApparelItemSchemaProps = {
      id: 'leather-bracers',
      name: 'Leather Bracers',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
      defenseValue: 31,
      apparelType: 'gloves',
      price: 25,
      weight: 2,
    } as ApparelItemSchemaProps;

    // Equip the first gloves
    gloves.use();
    expect(character.equippedGloves).toBe(gloves);

    // Equip a different gloves

    const newGloves = ItemMapper.toDomain(newGlovesProps, character);
    newGloves.use();
    expect(character.equippedGloves).toBe(newGloves);
  });

  it('should unequip the gloves if it is already equipped', () => {
    // Equip
    gloves.use();
    expect(character.equippedGloves).toBe(gloves);

    // Unequip
    gloves.use();
    expect(character.equippedGloves).toBeNull();
  });

  it('should return true for equipped if the helmet is the one equipped', () => {
    gloves.use();

    expect(gloves.equipped).toBe(true);
  });
});
