import { HelmetEntityMockFactory } from '../../../entities/factories/helmet.factory.js';
import { UserItemRefFactory } from '../../../entities/factories/user-item-ref.factory.js';
import ChestEntity from '../../apparel/chest.entity.js';
import HelmetEntity from '../../apparel/helmet.entity.js';

describe('Apparel item tests', () => {
  describe('when the item is a helmet', () => {
    it('should equip the selected helmet when the helmet slot is empty ', () => {
      const character = UserItemRefFactory();
      const helmet = HelmetEntityMockFactory({ characterId: character.id });

      console.log('Helmet:', helmet);

      expect(character.equippedHelmet).toBeNull();

      helmet.use();

      expect(character.equippedHelmet).toBe(helmet);
      expect(helmet.equipped).toBe(true);
    });

    it('should equip the selected helmet and remove the used when the helmet slot is not empty', () => {
      itemMock.equipped = true;

      const equippedHelmet = HelmetEntity.create(itemMock);
      equippedHelmet.character = character;
      character.equippedHelmet = equippedHelmet;

      expect(character.equippedHelmet).toBe(equippedHelmet);

      itemMock.equipped = false;
      itemMock.name = 'New Helmet';

      const newHelmet = new HelmetEntity(itemMock);
      newHelmet.character = character;

      newHelmet.use();

      expect(character.equippedHelmet).toBe(newHelmet);
      expect(newHelmet.equipped).toBe(true);
    });

    it('should unequip the item, if the item to be equipped itself', () => {
      itemMock.equipped = true;

      const helmet = new HelmetEntity(itemMock);
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
      const chest = new ChestEntity(itemMock);
      chest.character = character;

      expect(character.equippedChest).toBeNull();

      chest.use();

      expect(character.equippedChest).toBe(chest);
      expect(chest.equipped).toBe(true);
    });

    it('should equip the selected chest and remove the used when the chest slot is not empty', () => {
      itemMock.equipped = true;

      const equippedChest = new ChestEntity(itemMock);
      equippedChest.character = character;
      character.equippedChest = equippedChest;

      expect(character.equippedChest).toBe(equippedChest);

      itemMock.equipped = false;

      const newChest = new ChestEntity(itemMock);
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
