import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ConsumableItemProps } from '../../../../schemas/consumable.schema';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('HpPotionEntity', () => {
  let character: UserItemRef;
  let hpPotion: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: ConsumableItemProps = {
    id: 'potion-of-health',
    name: 'Potion of Health',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/3/32/TESV_HealthPotion.png/revision/latest?cb=20131209201729',
    effectValue: 67,
    type: 'consumable',
    consumableType: 'hp-potion',
  } as ConsumableItemProps;

  beforeEach(() => {
    character = UserItemRefFactory({ hpLevel: 100 }, {}, 'user-123');
    hpPotion = ItemMapper.toDomain(baseItem, character);
    character.addItemToInventory(hpPotion);
  });

  it('should increase hpLevel by the effectValue when used', () => {
    expect(character.hpLevel).toBe(100);

    hpPotion.use();

    expect(character.hpLevel).toBe(167);
  });

  it('should remove the potion from the inventory after use', () => {
    expect(
      character.inventory.find((item) => item.itemId === 'potion-of-health'),
    ).toBeDefined();

    hpPotion.use();

    expect(
      character.inventory.find((item) => item.itemId === 'potion-of-health'),
    ).toBeUndefined();
  });
});
