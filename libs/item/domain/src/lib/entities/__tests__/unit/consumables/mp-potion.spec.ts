import type { UserItemRef } from '../../../../refs/user-item.ref.js';
import type { ConsumableItemProps } from '../../../../schemas/consumable.schema.js';
import { ItemMapper } from '../../../../mappers/item.mapper.js';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory.js';

describe('MpPotionEntity', () => {
  let character: UserItemRef;
  let mpPotion: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: ConsumableItemProps = {
    id: 'potion-of-extra-magicka',
    name: 'Potion of Extra Magicka',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/8/88/Potion_of_Extra_Magicka.png/revision/latest?cb=20131213190349',
    effectValue: 58,
    type: 'consumable',
    consumableType: 'mp-potion',
  } as ConsumableItemProps;

  beforeEach(() => {
    character = UserItemRefFactory({ mpLevel: 100 }, {}, 'user-123');
    mpPotion = ItemMapper.toDomain(baseItem, character);
    character.addItemToInventory(mpPotion);
  });

  it('should increase mpLevel by the effectValue when used', () => {
    expect(character.mpLevel).toBe(100);

    mpPotion.use();

    expect(character.mpLevel).toBe(158);
  });

  it('should remove the potion from the inventory after use', () => {
    expect(
      character.inventory.find(
        (item) => item.itemId === 'potion-of-extra-magicka',
      ),
    ).toBeDefined();

    mpPotion.use();

    expect(
      character.inventory.find(
        (item) => item.itemId === 'potion-of-extra-magicka',
      ),
    ).toBeUndefined();
  });
});
