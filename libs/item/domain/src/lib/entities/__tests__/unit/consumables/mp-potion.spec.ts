import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { ConsumableItemProps } from '../../../../schemas/consumable.schema';
import type { InventoryItemEntity } from '../../../inventory-item.entity';
import { InventoryItemMapper } from '../../../../mappers';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('MpPotionEntity', () => {
  let character: UserItemRef;
  let mpPotion: ReturnType<typeof ItemMapper.toDomain>;
  let mpPotionInventoryItem: InventoryItemEntity;

  const baseItem: ConsumableItemProps = {
    id: 'potion-of-extra-magicka',
    name: 'Potion of Extra Magicka',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/8/88/Potion_of_Extra_Magicka.png/revision/latest?cb=20131213190349',
    effectValue: 58,
    type: 'consumable',
    consumableType: 'mp-potion',
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
      { mpLevel: 40 },
      { inventory: [inventoryItem1] },
      'user-123',
    );

    mpPotion = ItemMapper.toDomain(baseItem, character);
    mpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: mpPotion },
    );

    character.$watchedRelations.inventory.add(mpPotionInventoryItem);
  });

  it('should increase mpLevel by the effectValue when used', () => {
    expect(character.mpLevel).toBe(40);

    mpPotion.use();

    expect(character.mpLevel).toBe(98);
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

  it('should not exceed 100 even if the sum of the current value plus that of the potion exceeds', () => {
    const newCharacter = UserItemRefFactory(
      { mpLevel: 50 },
      { inventory: [inventoryItem1] },
      'user-123',
    );

    const newMpPotion = ItemMapper.toDomain(baseItem, newCharacter);
    const newMpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: newMpPotion },
    );

    newCharacter.$watchedRelations.inventory.add(newMpPotionInventoryItem);

    expect(newCharacter.mpLevel).toBe(50);

    newMpPotion.use();

    expect(newCharacter.mpLevel).toBe(100);
  });

  it('should not allow using the potion if the mpValue is full', () => {
    const newCharacter = UserItemRefFactory(
      { mpLevel: 100 },
      { inventory: [inventoryItem1] },
    );

    const newMpPotion = ItemMapper.toDomain(baseItem, newCharacter);
    const newMpPotionInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { item: newMpPotion },
    );

    newCharacter.$watchedRelations.inventory.add(newMpPotionInventoryItem);

    expect(newCharacter.mpLevel).toBe(100);

    expect(() => {
      newMpPotion.use();
    }).toThrowError('Item cannot be used: MP is full');

    expect(newCharacter.mpLevel).toBe(100);
  });
});
