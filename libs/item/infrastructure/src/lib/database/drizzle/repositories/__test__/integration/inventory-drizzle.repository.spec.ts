import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import type { DrizzleDB, DrizzleTX } from '@nx-ddd/database-infrastructure';
import type { DrizzleTestDB } from '@nx-ddd/database-infrastructure/drizzle/operators';
import type {
  ApparelItemSchemaProps,
  WeaponItemProps,
} from '@nx-ddd/item-domain';
import { getDatabaseTransactionToken } from '@nx-ddd/database-application';
import {
  DatabaseModule,
  DatabaseService,
  DRIZZLE_TOKEN,
} from '@nx-ddd/database-infrastructure';
import {
  eq,
  setupDrizzleTestDB,
} from '@nx-ddd/database-infrastructure/drizzle/operators';
import {
  userItem,
  userItem as userItemSchema,
  user as userSchema,
} from '@nx-ddd/database-infrastructure/drizzle/schema';
import {
  InventoryItemEntity,
  InventoryItemMapper,
  InventoryRepository,
  ItemMapper,
  ItemRepository,
  UserItemRefFactory,
} from '@nx-ddd/item-domain';
import { NotFoundError } from '@nx-ddd/shared-domain';
import { UserEntityMockFactory, UserRepository } from '@nx-ddd/user-domain';
import { UserModule } from '@nx-ddd/user-infrastructure';

import { InMemoryItemRepository } from '../../../../in-memory/repositories/in-memory-item.repository';
import { InventoryDrizzleRepository } from '../../inventory-drizzle.repository';

describe('InventoryDrizzleRepository', () => {
  let drizzleTestDB: DrizzleTestDB;
  let testModule: TestingModule;
  let inventoryDrizzleRepository: InventoryRepository.Repository;
  let databaseService: DatabaseService.Service;
  let itemProps: ApparelItemSchemaProps;

  beforeAll(async () => {
    drizzleTestDB = await setupDrizzleTestDB();
  });

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [DatabaseModule.forDrizzleTest(drizzleTestDB), UserModule],
      providers: [
        {
          provide: InventoryRepository.TOKEN,
          useFactory: (
            drizzle: DrizzleDB,
            drizzleTX: DrizzleTX,
            itemRepository: ItemRepository.Repository,
            userRepository: UserRepository.Repository,
          ) => {
            return new InventoryDrizzleRepository(
              drizzle,
              drizzleTX,
              itemRepository,
              userRepository,
            );
          },
          inject: [
            DRIZZLE_TOKEN,
            getDatabaseTransactionToken(),
            ItemRepository.TOKEN,
            UserRepository.TOKEN,
          ],
        },
        {
          provide: ItemRepository.TOKEN,
          useClass: InMemoryItemRepository,
        },
      ],
    }).compile();

    inventoryDrizzleRepository = testModule.get<InventoryRepository.Repository>(
      InventoryRepository.TOKEN,
    );
    databaseService = testModule.get<DatabaseService.Service>(
      DatabaseService.TOKEN,
    );
    await databaseService.cleanTables();

    itemProps = {
      id: 'dragonscale-helmet',
      name: 'Dragon Helmet',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
      defenseValue: 31,
      apparelType: 'helmet',
      price: 23,
      weight: 20,
      equipped: false,
    } as ApparelItemSchemaProps;
  });

  afterAll(async () => {
    await databaseService.teardown();
    await testModule.close();
  });

  it('should be defined', () => {
    expect(inventoryDrizzleRepository).toBeDefined();
  });

  describe('findByUserId', () => {
    it("should return a user's inventory items", async () => {
      // Arrange
      const user = UserEntityMockFactory();

      const item = ItemMapper.toDomain(itemProps);

      const inventoryItemProps = {
        itemId: item.id,
        userId: user.id,
        amount: 5,
      };

      await drizzleTestDB.db.insert(userSchema).values({ ...user.toJSON() });
      await drizzleTestDB.db.insert(userItemSchema).values(inventoryItemProps);

      // Act
      const result = await inventoryDrizzleRepository.findByUserId(user.id);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(InventoryItemEntity);
      expect(result[0].amount).toBe(5);
      expect(result[0].item.id).toBe(item.id);
    });

    it('should return empty array if user has no items', async () => {
      const user = UserEntityMockFactory();
      await drizzleTestDB.db.insert(userSchema).values({ ...user.toJSON() });

      const result = await inventoryDrizzleRepository.findByUserId(user.id);
      expect(result).toEqual([]);
    });

    it('should throw an error if the referenced item does not exist', async () => {
      const user = UserEntityMockFactory();
      const fakeItemId = 'error-item';

      await drizzleTestDB.db.insert(userSchema).values({ ...user.toJSON() });

      await drizzleTestDB.db.insert(userItemSchema).values({
        userId: user.id,
        itemId: fakeItemId,
        amount: 3,
      });

      await expect(
        inventoryDrizzleRepository.findByUserId(user.id),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('findByUserIdAndItemId', () => {
    it('should return an inventory item if found', async () => {
      const user = UserEntityMockFactory();

      const item = ItemMapper.toDomain(itemProps);

      const inventoryItemProps = {
        itemId: item.id,
        userId: user.id,
        amount: 5,
      };

      await drizzleTestDB.db.insert(userSchema).values({ ...user.toJSON() });
      await drizzleTestDB.db.insert(userItemSchema).values(inventoryItemProps);

      const result = await inventoryDrizzleRepository.findByUserIdAndItemId(
        user.id,
        item.id,
      );

      expect(result).toBeDefined();
      expect(result.item.id).toEqual(item.id);
      expect(result.character?.id).toEqual(user.id);
      expect(result.amount).toEqual(5);
    });

    it('should throw NotFoundError if inventory item is not found', async () => {
      await expect(
        inventoryDrizzleRepository.findByUserIdAndItemId(
          'nonexistent-user',
          'nonexistent-item',
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('syncByUser', () => {
    it('should insert new inventory items', async () => {
      // Arrange
      const character = UserItemRefFactory();

      const item = ItemMapper.toDomain(itemProps);

      const inventoryItem = InventoryItemMapper.toDomain(
        { amount: 1 },
        {
          item,
          character,
        },
      );

      await drizzleTestDB.db
        .insert(userSchema)
        .values({ ...character.toJSON() });

      vi.spyOn(
        character.$watchedRelations.inventory,
        'getNewItems',
      ).mockReturnValue([inventoryItem]);
      vi.spyOn(
        character.$watchedRelations.inventory,
        'getRemovedItems',
      ).mockReturnValue([]);

      // Act
      await inventoryDrizzleRepository.syncByUser(character);

      // Assert
      const results = await drizzleTestDB.db.query.userItem.findMany({
        where: eq(userItem.userId, character.id),
      });

      expect(results).toHaveLength(1);
      expect(results[0].itemId).toBe(inventoryItem.itemId);
      expect(results[0].userId).toBe(inventoryItem.characterId);
      expect(results[0].amount).toBe(inventoryItem.amount);
    });

    it('should delete removed inventory items', async () => {
      // Arrange
      const character = UserItemRefFactory();

      const item = ItemMapper.toDomain(itemProps);

      const inventoryItem = InventoryItemMapper.toDomain(
        { amount: 1 },
        {
          item,
          character,
        },
      );

      await drizzleTestDB.db
        .insert(userSchema)
        .values({ ...character.toJSON() });

      // Inserir item previamente no banco
      await drizzleTestDB.db.insert(userItem).values({
        itemId: inventoryItem.itemId,
        userId: inventoryItem.characterId,
        amount: inventoryItem.amount,
      });

      vi.spyOn(
        character.$watchedRelations.inventory,
        'getNewItems',
      ).mockReturnValue([]);
      vi.spyOn(
        character.$watchedRelations.inventory,
        'getRemovedItems',
      ).mockReturnValue([inventoryItem]);

      // Act
      await inventoryDrizzleRepository.syncByUser(character);

      // Assert
      const results = await drizzleTestDB.db.query.userItem.findMany({
        where: eq(userItem.userId, character.id),
      });

      expect(results).toHaveLength(0);
    });

    it('should insert and delete inventory items in the same call', async () => {
      // Arrange
      const character = UserItemRefFactory();

      const itemProps2 = {
        id: 'daedric-battleaxe',
        name: 'Daedric Battleaxe',
        image:
          'https://static.wikia.nocookie.net/elderscrolls/images/6/64/Daedricbattleaxe.png/revision/latest?cb=20120305203756',
        damageValue: 25,
        type: 'weapon',
        weaponType: 'two-hands',
        price: 2750,
        weight: 27,
      } as WeaponItemProps;

      const item = ItemMapper.toDomain(itemProps);
      const item2 = ItemMapper.toDomain(itemProps2);

      const inventoryItemToDelete = InventoryItemMapper.toDomain(
        { amount: 1 },
        {
          item,
          character,
        },
      );

      const inventoryItemToCreate = InventoryItemMapper.toDomain(
        { amount: 1 },
        {
          item: item2,
          character,
        },
      );

      await drizzleTestDB.db
        .insert(userSchema)
        .values({ ...character.toJSON() });

      await drizzleTestDB.db.insert(userItem).values({
        itemId: inventoryItemToDelete.itemId,
        userId: inventoryItemToDelete.characterId,
        amount: inventoryItemToDelete.amount,
      });

      vi.spyOn(
        character.$watchedRelations.inventory,
        'getNewItems',
      ).mockReturnValue([inventoryItemToCreate]);
      vi.spyOn(
        character.$watchedRelations.inventory,
        'getRemovedItems',
      ).mockReturnValue([inventoryItemToDelete]);

      // Act
      await inventoryDrizzleRepository.syncByUser(character);

      // Assert
      const results = await drizzleTestDB.db.query.userItem.findMany({
        where: eq(userItem.userId, character.id),
      });

      expect(results).toHaveLength(1);
      expect(results[0].itemId).toBe(inventoryItemToCreate.itemId);
      expect(results[0].amount).toBe(inventoryItemToCreate.amount);
    });

    it('should update the amount of an existing item if it has changed', async () => {
      // Arrange
      const character = UserItemRefFactory();

      const item = ItemMapper.toDomain(itemProps);

      const inventoryItem = InventoryItemMapper.toDomain(
        { amount: 1 },
        {
          item,
          character,
        },
      );

      const inventoryItemUpdated = InventoryItemMapper.toDomain(
        { amount: 2 },
        { item, character },
      );

      await drizzleTestDB.db
        .insert(userSchema)
        .values({ ...character.toJSON() });

      await drizzleTestDB.db.insert(userItem).values({
        itemId: inventoryItem.itemId,
        userId: inventoryItem.characterId,
        amount: inventoryItem.amount,
      });

      vi.spyOn(
        character.$watchedRelations.inventory,
        'getItems',
      ).mockReturnValue([inventoryItemUpdated]);

      await inventoryDrizzleRepository.syncByUser(character);

      // Assert
      const results = await drizzleTestDB.db.query.userItem.findMany({
        where: eq(userItem.userId, character.id),
      });

      expect(results).toHaveLength(1);
      expect(results[0].itemId).toBe(inventoryItem.itemId);
      expect(results[0].amount).toBe(2);
    });
  });
});
