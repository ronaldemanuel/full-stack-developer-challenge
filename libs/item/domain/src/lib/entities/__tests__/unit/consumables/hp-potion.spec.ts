import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ConsumableItemProps } from '../../../../schemas/consumable.schema';
import type { InventoryItemEntity } from '../../../inventory-item.entity';
import { InventoryItemMapper } from '../../../../mappers';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('HpPotionEntity', () => {
  let character: UserItemRef;
  let hpPotion: ReturnType<typeof ItemMapper.toDomain>;
  let hpPotionInventoryItem: InventoryItemEntity;

  const baseItem: ConsumableItemProps = {
    id: 'potion-of-health',
    name: 'Potion of Health',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/3/32/TESV_HealthPotion.png/revision/latest?cb=20131209201729',
    effectValue: 67,
    type: 'consumable',
    consumableType: 'hp-potion',
  } as ConsumableItemProps;

  const baseCoin: ConsumableItemProps = {
    id: 'coin',
    name: 'Coin',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/5/55/Septim_Skyrim.png/revision/latest?cb=20120311100037',
    type: 'misc',
    price: 0,
    weight: 0.1,
  } as ConsumableItemProps;

  const coin = ItemMapper.toDomain(baseCoin);
  const inventoryItem1 = InventoryItemMapper.toDomain(
    { amount: 1000 },
    { item: coin },
  );

  beforeEach(() => {
    character = UserItemRefFactory(
      { hpLevel: 10 },
      { inventory: [inventoryItem1] },
    );
    hpPotion = ItemMapper.toDomain(baseItem, character);
    hpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: hpPotion },
    );
    character.$watchedRelations.inventory.add(hpPotionInventoryItem);
  });

  it('should increase hpLevel by the effectValue when used', () => {
    expect(character.hpLevel).toBe(10);

    hpPotion.use();

    expect(character.hpLevel).toBe(77);
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

  it('should not exceed 100 even if the sum of the current value plus that of the potion exceeds', () => {
    const newCharacter = UserItemRefFactory(
      { hpLevel: 50 },
      { inventory: [inventoryItem1] },
      'user-123',
    );

    const newHpPotion = ItemMapper.toDomain(baseItem, newCharacter);
    const newHpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: newHpPotion },
    );

    newCharacter.$watchedRelations.inventory.add(newHpPotionInventoryItem);

    expect(newCharacter.hpLevel).toBe(50);

    newHpPotion.use();

    expect(newCharacter.hpLevel).toBe(100);
  });

  it('should not allow using the potion if the hpValue is full', () => {
    const newCharacter = UserItemRefFactory(
      { hpLevel: 100 },
      { inventory: [inventoryItem1] },
    );

    const newHpPotion = ItemMapper.toDomain(baseItem, newCharacter);
    const newHpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: newHpPotion },
    );

    newCharacter.$watchedRelations.inventory.add(newHpPotionInventoryItem);

    expect(newCharacter.hpLevel).toBe(100);

    expect(() => {
      newHpPotion.use();
    }).toThrowError('Item cannot be used: HP is full');

    expect(newCharacter.hpLevel).toBe(100);
  });
});
