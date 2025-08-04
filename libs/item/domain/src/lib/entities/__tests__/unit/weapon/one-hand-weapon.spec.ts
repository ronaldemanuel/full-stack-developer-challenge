import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { WeaponItemProps } from '../../../../schemas/weapon.schema';
import type { OneHandedWeaponEntity } from '../../../weapon/one-handed-weapon.entity';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('OneHandedWeaponEntity', () => {
  let character: UserItemRef;
  let weapon: OneHandedWeaponEntity;

  const baseItem: WeaponItemProps = {
    id: 'ebony-sword',
    name: 'Ebony Sword',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/d/d1/Ebonysword.png/revision/latest?cb=20120513000536',
    damageValue: 13,
    type: 'weapon',
    weaponType: 'one-hand',
  } as WeaponItemProps;

  beforeEach(() => {
    character = UserItemRefFactory({}, {}, 'user-123');
    weapon = ItemMapper.toDomain(baseItem, character) as OneHandedWeaponEntity;
  });
  it('should equip the weapon in the left hand if left hand is free', () => {
    weapon.use();

    expect(character.leftHand).toBe(weapon.id);
    expect(character.rightHand).toBeNull();
  });

  it('should unequip the weapon if already equipped in the left hand', () => {
    character.leftHand = weapon.id;

    weapon.use();

    expect(character.leftHand).toBeNull();
  });

  it('should move existing leftHand weapon to rightHand and equip new one in leftHand', () => {
    const baseItem: OneHandedWeaponEntity = {
      id: 'iron-sword',
      name: 'Iron Sword',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/c/c7/Iron_Sword.png/revision/latest?cb=20121012152339',
      damageValue: 13,
      type: 'weapon',
      weaponType: 'one-hand',
    } as OneHandedWeaponEntity;

    const newWeapon = ItemMapper.toDomain(baseItem, character);

    weapon.use();

    newWeapon.use();

    expect(character.leftHand).toBe(newWeapon.id);
    expect(character.rightHand).toBe(weapon.id);
  });

  it('should return true for equipped if weapon is in left hand', () => {
    character.leftHand = weapon.id;

    expect(weapon.equipped).toBe(true);
  });

  it('should return true for equipped if weapon is in right hand', () => {
    character.rightHand = weapon.id;

    expect(weapon.equipped).toBe(true);
  });

  it('should return false for equipped if weapon is in no hand', () => {
    expect(weapon.equipped).toBe(false);
  });
});
