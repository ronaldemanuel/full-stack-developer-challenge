import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ConsumableItemProps } from '../../../../schemas/consumable.schema';
import type { InventoryItemEntity } from '../../../inventory-item.entity';
import { InventoryItemMapper } from '../../../../mappers';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('SpPotionEntity', () => {
  let character: UserItemRef;
  let spPotion: ReturnType<typeof ItemMapper.toDomain>;
  let spPotionInventoryItem: InventoryItemEntity;

  const baseItem: ConsumableItemProps = {
    id: 'potion-of-minor-stamina',
    name: 'Potion of Minor Stamina',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/4/48/Potion_of_Minor_Stamina.png/revision/latest?cb=20131216184139',
    type: 'consumable',
    price: 20,
    weight: 0,
    consumableType: 'sp-potion',
    effectValue: 25,
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
      { spLevel: 40 },
      { inventory: [inventoryItem1] },
    );

    spPotion = ItemMapper.toDomain(baseItem, character);
    spPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: spPotion },
    );

    character.$watchedRelations.inventory.add(spPotionInventoryItem);
  });

  it('should increase spLevel by the effectValue when used', () => {
    expect(character.spLevel).toBe(40);

    spPotion.use();

    expect(character.spLevel).toBe(65);
  });

  it('should remove the potion from the inventory after use', () => {
    expect(
      character.inventory.find(
        (item) => item.itemId === 'potion-of-minor-stamina',
      ),
    ).toBeDefined();

    spPotion.use();

    expect(
      character.inventory.find(
        (item) => item.itemId === 'potion-of-minor-stamina',
      ),
    ).toBeUndefined();
  });

  it('should not exceed 100 even if the sum of the current value plus that of the potion exceeds', () => {
    const newCharacter = UserItemRefFactory(
      { spLevel: 99 },
      { inventory: [inventoryItem1] },
      'user-123',
    );

    const newSpPotion = ItemMapper.toDomain(baseItem, newCharacter);
    const newSpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: newSpPotion },
    );

    newCharacter.$watchedRelations.inventory.add(newSpPotionInventoryItem);

    expect(newCharacter.spLevel).toBe(99);

    newSpPotion.use();

    expect(newCharacter.spLevel).toBe(100);
  });

  it('should not allow using the potion if the spValue is full', () => {
    const newCharacter = UserItemRefFactory(
      { spLevel: 100 },
      { inventory: [inventoryItem1] },
    );

    const newSpPotion = ItemMapper.toDomain(baseItem, newCharacter);
    const newSpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: newSpPotion },
    );

    newCharacter.$watchedRelations.inventory.add(newSpPotionInventoryItem);

    expect(newCharacter.spLevel).toBe(100);

    expect(() => {
      newSpPotion.use();
    }).toThrowError('Item cannot be used: SP is full');

    expect(newCharacter.spLevel).toBe(100);
  });
});
