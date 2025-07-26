import type { UserItemRef } from '../../../../refs/user-item.ref.js';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema.js';
import GlovesEntity from '../../../../entities/apparel/gloves.entity.js';
import { UserItemRefFactory } from '../../../../entities/factories/user-item-ref.factory.js';
import { ItemMapper } from '../../../item.mapper.js';

describe('GlovesEntity - ItemMapper', () => {
  const mockCharacter: UserItemRef = UserItemRefFactory({ id: 'user-123' });

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-gautlets',
    name: 'Dragonscale Gautlets',
    type: 'apparel',
    image: 'https://example.com/dragon-gloves.png',
    apparelType: 'gloves',
    defenseValue: 12,
  } as ApparelItemSchemaProps;

  it('should correctly map to GlovesEntity with character data', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item).toBeInstanceOf(GlovesEntity);

    if (item instanceof GlovesEntity) {
      expect(item.equipped).toBe(false);
      expect(item.defenseValue).toBe(12);
      expect(item.apparelType).toBe('gloves');
      expect(item.name).toBe('Dragonscale Gautlets');
      expect(item.image).toContain('dragon-gloves');
    }
  });

  it('should map correctly without character reference', () => {
    const item = ItemMapper.toDomain(baseItem);

    expect(item).toBeInstanceOf(GlovesEntity);

    if (item instanceof GlovesEntity) {
      expect(() => item.character).toThrow('This item has no character');
    }
  });

  it('should retain base item properties', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item.id).toBe('dragonscale-gautlets');
    expect(item.name).toBe('Dragonscale Gautlets');
    expect(item.image).toBeDefined();
  });
});
