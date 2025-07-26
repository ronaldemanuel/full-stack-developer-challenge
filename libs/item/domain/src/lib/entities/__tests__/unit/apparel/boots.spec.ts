import type { UserItemRef } from '../../../../refs/user-item.ref.js';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema.js';
import { ItemMapper } from '../../../../mappers/item.mapper.js';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory.js';

describe('BootsEntity', () => {
  let character: UserItemRef;
  let boots: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-boots',
    name: 'Dragon Boots',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 31,
    apparelType: 'boots',
  } as ApparelItemSchemaProps;

  beforeEach(() => {
    character = UserItemRefFactory({}, {}, 'user-123');
    boots = ItemMapper.toDomain(baseItem, character);
  });

  it('should equip the boots if no boots is currently equipped', () => {
    boots.use();

    expect(character.equippedBoots).toBe(boots);
  });

  it('should replace the currently equipped boots with a new one', () => {
    const newBootsProps: ApparelItemSchemaProps = {
      id: 'leather-boots',
      name: 'Leather Boots',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
      defenseValue: 26,
      apparelType: 'boots',
    } as ApparelItemSchemaProps;

    // Equip the first boots
    boots.use();
    expect(character.equippedBoots).toBe(boots);

    // Equip a different boots

    const newBoots = ItemMapper.toDomain(newBootsProps, character);
    newBoots.use();
    expect(character.equippedBoots).toBe(newBoots);
  });

  it('should unequip the boots if it is already equipped', () => {
    // Equip
    boots.use();
    expect(character.equippedBoots).toBe(boots);

    // Unequip
    boots.use();
    expect(character.equippedBoots).toBeNull();
  });

  it('should return true for equipped if the helmet is the one equipped', () => {
    boots.use();

    expect(boots.equipped).toBe(true);
  });
});
