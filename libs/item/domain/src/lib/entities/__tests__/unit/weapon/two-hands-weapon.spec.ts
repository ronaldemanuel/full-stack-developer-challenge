import type { UserItemRef } from '../../../../refs/user-item.ref.js';
import type { WeaponItemProps } from '../../../../schemas/weapon.schema.js';
import { ItemMapper } from '../../../../mappers/item.mapper.js';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory.js';

describe('TwoHandedWeaponEntity', () => {
  let character: UserItemRef;
  let weapon: ReturnType<typeof ItemMapper.toDomain>;

  const baseItem: WeaponItemProps = {
    id: 'daedric-battleaxe',
    name: 'Daedric Battleaxe',
    image:
      'https://static.wikia.nocookie.net/elderscrolls/images/6/64/Daedricbattleaxe.png/revision/latest?cb=20120305203756',
    damageValue: 25,
    type: 'weapon',
    weaponType: 'two-hands',
  } as WeaponItemProps;

  beforeEach(() => {
    character = UserItemRefFactory({}, {}, 'user-123');
    weapon = ItemMapper.toDomain(baseItem, character);
  });

  it('should equip the weapon in both hands if hands are free', () => {
    weapon.use();

    expect(character.leftHand).toBe(weapon);
    expect(character.rightHand).toBe(weapon);
  });

  it('should replace whatever is in the hands and equip the two-handed weapon', () => {
    const oldWeapon = {} as any;
    character.leftHand = oldWeapon;
    character.rightHand = oldWeapon;

    weapon.use();

    expect(character.leftHand).toBe(weapon);
    expect(character.rightHand).toBe(weapon);
  });

  it('should unequip the weapon if it is already equipped in both hands', () => {
    weapon.use();

    expect(character.leftHand).toBe(weapon);
    expect(character.rightHand).toBe(weapon);

    weapon.use();

    expect(character.leftHand).toBeNull();
    expect(character.rightHand).toBeNull();
  });

  it('should return true for equipped if weapon is in both hands', () => {
    weapon.use();

    expect(weapon.equipped).toBe(true);
  });

  it('should return false for equipped if weapon is not in both hands', () => {
    const baseItem: WeaponItemProps = {
      id: 'ebony-sword',
      name: 'Ebony Sword',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/d/d1/Ebonysword.png/revision/latest?cb=20120513000536',
      damageValue: 13,
      type: 'weapon',
      weaponType: 'one-hand',
    } as WeaponItemProps;

    const oneHandWeapon = ItemMapper.toDomain(baseItem, character);

    character.leftHand = oneHandWeapon;
    character.rightHand = null;

    expect(weapon.equipped).toBe(false);
  });
});
