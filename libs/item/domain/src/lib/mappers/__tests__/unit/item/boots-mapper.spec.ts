import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ApparelItemSchemaProps } from '../../../../schemas/apparel.schema';
import { BootsEntity } from '../../../../entities/apparel/boots.entity';
import { UserItemRefFactory } from '../../../../entities/factories/user-item-ref.factory';
import { ItemMapper } from '../../../item.mapper';

describe('BootsEntity - ItemMapper', () => {
  const mockCharacter: UserItemRef = UserItemRefFactory({}, {}, 'user-123');

  const baseItem: ApparelItemSchemaProps = {
    id: 'dragonscale-boots',
    name: 'Dragonscale Boots',
    type: 'apparel',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Boots.png/revision/latest?cb=20170829115634',
    apparelType: 'boots',
    defenseValue: 12,
  } as ApparelItemSchemaProps;

  it('should correctly map to BootsEntity with character data', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item).toBeInstanceOf(BootsEntity);

    if (item instanceof BootsEntity) {
      expect(item.character.id).toBe('user-123');
      expect(item.equipped).toBe(false);
      expect(item.defenseValue).toBe(12);
      expect(item.apparelType).toBe('boots');
      expect(item.name).toBe('Dragonscale Boots');
      expect(item.image).toContain('Dragonscale_Boots');
    }
  });

  it('should map correctly without character reference', () => {
    const item = ItemMapper.toDomain(baseItem);

    expect(item).toBeInstanceOf(BootsEntity);

    if (item instanceof BootsEntity) {
      expect(item.character).toBeUndefined();
    }
  });

  it('should retain base item properties', () => {
    const item = ItemMapper.toDomain(baseItem, mockCharacter);

    expect(item.id).toBe('dragonscale-boots');
    expect(item.name).toBe('Dragonscale Boots');
    expect(item.image).toBeDefined();
  });
});
