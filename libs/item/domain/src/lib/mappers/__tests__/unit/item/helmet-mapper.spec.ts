import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema';
import HelmetEntity from '../../../../entities/apparel/helmet.entity';
import { UserItemRefFactory } from '../../../../entities/factories/user-item-ref.factory';
import { ItemMapper } from '../../../item.mapper';

describe('Helmet Item Mapper', () => {
  const mockCharacter: UserItemRef = UserItemRefFactory({}, {}, 'user-123');

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-helmet',
    name: 'Dragon Helmet',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    defenseValue: 31,
    apparelType: 'helmet',
  } as ApparelItemSchemaProps;

  it('should correctly map to HelmetEntity with character data', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item).toBeInstanceOf(HelmetEntity);

    if (item instanceof HelmetEntity) {
      expect(item.character.id).toBe('user-123');
      expect(item.equipped).toBe(false);
      expect(item.defenseValue).toBe(31);
      expect(item.apparelType).toBe('helmet');
      expect(item.name).toBe('Dragon Helmet');
      expect(item.image).toContain('Dragonscale_Helmet');
    } else {
      throw new Error('Returned item is not a HelmetEntity');
    }
  });

  it('should throw an error if item class is not found in the map', () => {
    const invalidItem = { ...baseItem, id: 'unknown-item' };

    expect(() => {
      ItemMapper.toDomain(invalidItem, mockCharacter);
    }).toThrow('Item class not found for identifier: unknown-item');
  });

  it('should map correctly even without a character reference', () => {
    const item = ItemMapper.toDomain(baseItem);

    expect(item).toBeInstanceOf(HelmetEntity);

    if (item instanceof HelmetEntity) {
      expect(() => item.character).toThrow('This item has no character');
    }
  });

  it('should retain base item properties after mapping', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item.id).toBe('dragonscale-helmet');
    expect(item.name).toBe('Dragon Helmet');
    expect(item.image).toBeDefined();
  });
});
