import type { UserItemRef } from '../../../../refs/user-item.ref';
import type { WeaponItemProps } from '../../../../schemas/weapon.schema';
import type { TwoHandedWeaponEntity } from '../../../weapon/two-handed-weapon.entity';
import { ItemMapper } from '../../../../mappers/item.mapper';
import { UserItemRefFactory } from '../../../factories/user-item-ref.factory';

describe('TwoHandedWeaponEntity', () => {
  let character: UserItemRef;
  let weapon: TwoHandedWeaponEntity;

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
    weapon = ItemMapper.toDomain(baseItem, character) as TwoHandedWeaponEntity;
  });

  it('should equip the weapon in both hands if hands are free', () => {
    weapon.use();

    expect(character.leftHand).toBe(weapon.id);
    expect(character.rightHand).toBe(weapon.id);
  });

  it('should replace whatever is in the hands and equip the two-handed weapon', () => {
    const oldWeapon = {} as any;
    character.leftHand = oldWeapon;
    character.rightHand = oldWeapon;

    weapon.use();

    expect(character.leftHand).toBe(weapon.id);
    expect(character.rightHand).toBe(weapon.id);
  });

  it('should unequip the weapon if it is already equipped in both hands', () => {
    weapon.use();

    expect(character.leftHand).toBe(weapon.id);
    expect(character.rightHand).toBe(weapon.id);

    weapon.use();

    expect(character.leftHand).toBeNull();
    expect(character.rightHand).toBeNull();
  });

  it('should return true for equipped if weapon is in both hands', () => {
    weapon.use();

    expect(weapon.equipped).toBe(true);
  });

  it('should return false for equipped if weapon is not in both hands', () => {
    character.leftHand = weapon.id;
    character.rightHand = null;

    expect(weapon.equipped).toBe(false);
  });
});
