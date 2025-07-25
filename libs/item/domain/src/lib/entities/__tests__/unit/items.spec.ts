import { UserItemRef } from '../../../refs/user-item.ref.js';
import BootsEntity from '../../apparel/boots.entity.js';
import ChestEntity from '../../apparel/chest.entity.js';
import GlovesEntity from '../../apparel/gloves.entity.js';
import HelmetEntity from '../../apparel/helmet.entity.js';
import TwoHandedWeaponEntity from '../../weapon/two-handed-weapon.entity.js';

describe('Items Entity', () => {
  let character: UserItemRef;

  beforeEach(() => {
    const characterProps = {
      name: 'Test Character',
      hpLevel: 100,
      spLevel: 50,
      mpLevel: 30,
      equippedHelmet: null,
      equippedGloves: null,
      equippedChest: null,
      equippedBoots: null,
      leftHand: null,
      rightHand: null,
      email: 'test@email.com',
      emailVerified: true,
    };

    character = UserItemRef.create(characterProps);
  });
  describe('when use apparel item', () => {
    describe('when the item is a helmet', () => {
      it('should equip the selected helmet when the helmet slot is empty ', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const helmet = new HelmetEntity(itemsProps);
        helmet.character = character;

        expect(character.equippedHelmet).toBeNull();

        helmet.use();

        expect(character.equippedHelmet).toBe(helmet);
        expect(helmet.equipped).toBe(true);
      });

      it('should equip the selected helmet and remove the used when the helmet slot is not empty', () => {
        const equippedItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const equippedHelmet = new HelmetEntity(equippedItemProps);
        equippedHelmet.character = character;
        character.equippedHelmet = equippedHelmet;

        expect(character.equippedHelmet).toBe(equippedHelmet);

        const newItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const newHelmet = new HelmetEntity(newItemProps);
        newHelmet.character = character;

        newHelmet.use();

        expect(character.equippedHelmet).toBe(newHelmet);
        expect(newHelmet.equipped).toBe(true);
      });

      it('should unequip the item, if the item to be equipped itself', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const helmet = new HelmetEntity(itemsProps);
        helmet.character = character;
        character.equippedHelmet = helmet;

        expect(character.equippedHelmet).toBe(helmet);

        helmet.use();

        expect(character.equippedHelmet).toBeNull();
        expect(helmet.equipped).toBe(false);
      });
    });
    describe('when the item is a chest', () => {
      it('should equip the selected chest when the chest slot is empty ', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const chest = new ChestEntity(itemsProps);
        chest.character = character;

        expect(character.equippedChest).toBeNull();

        chest.use();

        expect(character.equippedChest).toBe(chest);
        expect(chest.equipped).toBe(true);
      });

      it('should equip the selected chest and remove the used when the chest slot is not empty', () => {
        const equippedItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const equippedChest = new ChestEntity(equippedItemProps);
        equippedChest.character = character;
        character.equippedChest = equippedChest;

        expect(character.equippedChest).toBe(equippedChest);

        const newItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const newChest = new ChestEntity(newItemProps);
        newChest.character = character;

        newChest.use();

        expect(character.equippedChest).toBe(newChest);
        expect(newChest.equipped).toBe(true);
      });

      it('should unequip the item, if the item to be equipped itself', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const chest = new ChestEntity(itemsProps);
        chest.character = character;
        character.equippedChest = chest;

        expect(character.equippedChest).toBe(chest);

        chest.use();

        expect(character.equippedChest).toBeNull();
        expect(chest.equipped).toBe(false);
      });
    });
    describe('when the item is a glover', () => {
      it('should equip the selected chest when the gloves slot is empty ', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const gloves = new GlovesEntity(itemsProps);
        gloves.character = character;

        expect(character.equippedGloves).toBeNull();

        gloves.use();

        expect(character.equippedGloves).toBe(gloves);
        expect(gloves.equipped).toBe(true);
      });

      it('should equip the selected gloves and remove the used when the gloves slot is not empty', () => {
        const equippedItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const equippedGloves = new GlovesEntity(equippedItemProps);
        equippedGloves.character = character;
        character.equippedGloves = equippedGloves;

        expect(character.equippedGloves).toBe(equippedGloves);

        const newItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const newGloves = new GlovesEntity(newItemProps);
        newGloves.character = character;

        newGloves.use();

        expect(character.equippedGloves).toBe(newGloves);
        expect(newGloves.equipped).toBe(true);
      });

      it('should unequip the item, if the item to be equipped itself', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const gloves = new GlovesEntity(itemsProps);
        gloves.character = character;
        character.equippedGloves = gloves;

        expect(character.equippedGloves).toBe(gloves);

        gloves.use();

        expect(character.equippedGloves).toBeNull();
        expect(gloves.equipped).toBe(false);
      });
    });
    describe('when the item is a boots', () => {
      it('should equip the selected chest when the boots slot is empty ', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const boots = new BootsEntity(itemsProps);
        boots.character = character;

        expect(character.equippedBoots).toBeNull();

        boots.use();

        expect(character.equippedBoots).toBe(boots);
        expect(boots.equipped).toBe(true);
      });

      it('should equip the selected boots and remove the used when the boots slot is not empty', () => {
        const equippedItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const equippedBoots = new BootsEntity(equippedItemProps);
        equippedBoots.character = character;
        character.equippedBoots = equippedBoots;

        expect(character.equippedBoots).toBe(equippedBoots);

        const newItemProps = {
          name: 'Equipped Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: false,
        };

        const newBoots = new BootsEntity(newItemProps);
        newBoots.character = character;

        newBoots.use();

        expect(character.equippedBoots).toBe(newBoots);
        expect(newBoots.equipped).toBe(true);
      });

      it('should unequip the item, if the item to be equipped itself', () => {
        const itemsProps = {
          name: 'Test Item',
          image: 'http://example.com/image.png',
          stackNumber: 1,
          equipped: true,
        };

        const boots = new BootsEntity(itemsProps);
        boots.character = character;
        character.equippedBoots = boots;

        expect(character.equippedBoots).toBe(boots);

        boots.use();

        expect(character.equippedBoots).toBeNull();
        expect(boots.equipped).toBe(false);
      });
    });
  });

  describe('when use weapon item', () => {
    describe('when the item is a two-handed weapon', () => {
      it('should equip the selected weapon when both hands are empty', () => {
        const itemProps = {
          name: 'Test Weapon',
          image: 'http://example.com/weapon.png',
          stackNumber: 1,
          equipped: false,
        };

        const weapon = TwoHandedWeaponEntity.create(itemProps);
        weapon.character = character;

        expect(character.leftHand).toBeNull();
        expect(character.rightHand).toBeNull();

        weapon.use();

        expect(character.leftHand).toBe(weapon);
        expect(character.rightHand).toBe(weapon);
        expect(weapon.equipped).toBe(true);
      });

      it('should equip the selected weapon and unequip previous weapon when left hand are occupied', () => {
        const equippedWeaponProps = {
          name: 'Test Weapon',
          image: 'http://example.com/weapon.png',
          stackNumber: 1,
          equipped: true,
        };

        const equippedWeapon = new TwoHandedWeaponEntity(equippedWeaponProps);
        equippedWeapon.character = character;
        character.leftHand = equippedWeapon;

        expect(character.leftHand).toBe(equippedWeapon);
        expect(character.rightHand).toBeNull();

        const newWeaponProps = {
          name: 'Test Weapon',
          image: 'http://example.com/weapon.png',
          stackNumber: 1,
          equipped: false,
        };

        const newWeapon = new TwoHandedWeaponEntity(newWeaponProps);
        newWeapon.character = character;

        newWeapon.use();

        expect(character.leftHand).toBe(newWeapon);
        expect(character.rightHand).toBe(newWeapon);
        expect(newWeapon.equipped).toBe(true);
        expect(equippedWeapon.equipped).toBe(false);
      });

      it('should equip the selected weapon and unequip previous weapon when right hand are occupied', () => {
        const equippedWeaponProps = {
          name: 'Test Weapon',
          image: 'http://example.com/weapon.png',
          stackNumber: 1,
          equipped: true,
        };

        const equippedWeapon = new TwoHandedWeaponEntity(equippedWeaponProps);
        equippedWeapon.character = character;
        character.rightHand = equippedWeapon;

        expect(character.rightHand).toBe(equippedWeapon);
        expect(character.leftHand).toBeNull();

        const newWeaponProps = {
          name: 'Test Weapon',
          image: 'http://example.com/weapon.png',
          stackNumber: 1,
          equipped: false,
        };

        const newWeapon = new TwoHandedWeaponEntity(newWeaponProps);
        newWeapon.character = character;

        newWeapon.use();

        expect(character.leftHand).toBe(newWeapon);
        expect(character.rightHand).toBe(newWeapon);
        expect(newWeapon.equipped).toBe(true);
        expect(equippedWeapon.equipped).toBe(false);
      });

      it('should unequip the weapon if the item to be equipped itself', () => {
        const itemProps = {
          name: 'Test Weapon',
          image: 'http://example.com/weapon.png',
          stackNumber: 1,
          equipped: true,
        };

        const weapon = new TwoHandedWeaponEntity(itemProps);
        weapon.character = character;
        character.leftHand = weapon;
        character.rightHand = weapon;

        expect(character.leftHand).toBe(weapon);
        expect(character.rightHand).toBe(weapon);

        weapon.use();

        expect(character.leftHand).toBeNull();
        expect(character.rightHand).toBeNull();
        expect(weapon.equipped).toBe(false);
      });
    });
  });
});
