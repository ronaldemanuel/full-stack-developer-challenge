import type { UserItemRef } from '../../../../refs/user-item.ref.js';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema.js';
import { ItemMapper } from '../../../../mappers/item.mapper.js';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory.js';

describe('ChestEntity', () => {
  let character: UserItemRef;
  let chest: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-armor',
    name: 'Dragon Armor',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 31,
    apparelType: 'chest',
  } as ApparelItemSchemaProps;

  beforeEach(() => {
    character = UserItemRefFactory({}, {}, 'user-123');
    chest = ItemMapper.toDomain(baseItem, character);
  });

  it('should equip the chest if no chest is currently equipped', () => {
    chest.use();

    expect(character.equippedChest).toBe(chest);
  });

  it('should replace the currently equipped chest with a new one', () => {
    const newChestProps: ApparelItemSchemaProps = {
      id: 'leather-armor',
      name: 'Leather Armor',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
      defenseValue: 26,
      apparelType: 'chest',
    } as ApparelItemSchemaProps;

    // Equip the first chest
    chest.use();
    expect(character.equippedChest).toBe(chest);

    // Equip a different chest

    const newChest = ItemMapper.toDomain(newChestProps, character);
    newChest.use();
    expect(character.equippedChest).toBe(newChest);
  });

  it('should unequip the chest if it is already equipped', () => {
    // Equip
    chest.use();
    expect(character.equippedChest).toBe(chest);

    // Unequip
    chest.use();
    expect(character.equippedChest).toBeNull();
  });

  it('should return true for equipped if the helmet is the one equipped', () => {
    chest.use();

    expect(chest.equipped).toBe(true);
  });
});
