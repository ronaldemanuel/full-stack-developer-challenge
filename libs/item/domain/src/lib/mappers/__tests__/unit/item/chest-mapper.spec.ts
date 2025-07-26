import type { UserItemRef } from '../../../../refs/user-item.ref.js';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema.js';
import ChestEntity from '../../../../entities/apparel/chest.entity.js';
import { UserItemRefFactory } from '../../../../entities/factories/user-item-ref.factory.js';
import { ItemMapper } from '../../../item.mapper.js';

describe('ChestEntity - ItemMapper', () => {
  const mockCharacter: UserItemRef = UserItemRefFactory({}, {}, 'user-123');

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-armor',
    name: 'Dragonscale Armor',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/7/79/Dragonscale_Armor_%28Armor_Piece%29.png/revision/latest?cb=20170829115633',
    apparelType: 'chest',
    defenseValue: 41,
  } as ApparelItemSchemaProps;

  it('should correctly map to ChestEntity with character data', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item).toBeInstanceOf(ChestEntity);

    if (item instanceof ChestEntity) {
      expect(item.character.id).toBe('user-123');
      expect(item.equipped).toBe(false);
      expect(item.defenseValue).toBe(41);
      expect(item.apparelType).toBe('chest');
      expect(item.name).toBe('Dragonscale Armor');
      expect(item.image).toContain('Dragonscale_Armor');
    }
  });

  it('should map correctly without character reference', () => {
    const item = ItemMapper.toDomain(baseItem);

    expect(item).toBeInstanceOf(ChestEntity);

    if (item instanceof ChestEntity) {
      expect(() => item.character).toThrow('This item has no character');
    }
  });

  it('should retain base item properties', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item.id).toBe('dragonscale-armor');
    expect(item.name).toBe('Dragonscale Armor');
    expect(item.image).toBeDefined();
  });
});
