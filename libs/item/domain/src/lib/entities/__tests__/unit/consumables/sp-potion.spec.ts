import type { UserItemRef } from '../../../../refs/user-item.ref.js';
import type { ConsumableItemProps } from '../../../../schemas/consumable.schema.js';
import { ItemMapper } from '../../../../mappers/item.mapper.js';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory.js';

describe('SpPotionEntity', () => {
  let character: UserItemRef;
  let spPotion: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: ConsumableItemProps = {
    id: 'potion-of-enhanced-stamina',
    name: 'Potion of Enhanced Stamina',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/5/57/Potion_of_Enhanced_Stamina.png/revision/latest?cb=20131213191733',
    effectValue: 341,
    type: 'consumable',
    consumableType: 'sp-potion',
  } as ConsumableItemProps;

  beforeEach(() => {
    character = UserItemRefFactory({ spLevel: 1000 }, {}, 'user-123');
    spPotion = ItemMapper.toDomain(baseItem, character);
    character.addItemToInventory(spPotion);
  });

  it('should increase spLevel by the effectValue when used', () => {
    expect(character.spLevel).toBe(1000);

    spPotion.use();

    expect(character.spLevel).toBe(1341);
  });

  it('should remove the potion from the inventory after use', () => {
    expect(
      character.inventory.find(
        (item) => item.itemId === 'potion-of-enhanced-stamina',
      ),
    ).toBeDefined();

    spPotion.use();

    expect(
      character.inventory.find(
        (item) => item.itemId === 'potion-of-enhanced-stamina',
      ),
    ).toBeUndefined();
  });
});
