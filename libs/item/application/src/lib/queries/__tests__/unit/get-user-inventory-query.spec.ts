import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import type { ItemEntity, ItemSchema, UserItemRef } from '@nx-ddd/item-domain';
import {
  InventoryInMemoryRepository,
  InventoryItemMapper,
  InventoryRepository,
  ItemMapper,
  UserItemRefFactory,
} from '@nx-ddd/item-domain';

import { GetUserInventoryQuery } from '../../get-user-inventory.query';

describe('GetUserInventoryQuery', () => {
  let getUserInventoryQuery: GetUserInventoryQuery.Handler;
  let inventoryRepository: InventoryRepository.Repository;

  let mockUser: UserItemRef;

  let mockItem1: ItemEntity;
  let mockItem2: ItemEntity;

  let mockItems: ItemEntity[];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [
        GetUserInventoryQuery.Handler,
        {
          provide: InventoryRepository.TOKEN,
          useClass: InventoryInMemoryRepository,
        },
      ],
    }).compile();

    getUserInventoryQuery = moduleRef.get<GetUserInventoryQuery.Handler>(
      GetUserInventoryQuery.Handler,
    );
    inventoryRepository = moduleRef.get<InventoryRepository.Repository>(
      InventoryRepository.TOKEN,
    );

    // Arrange
    mockUser = UserItemRefFactory();

    const baseItem1: ItemSchema = {
      id: 'dragonscale-boots',
      name: 'Dragon Boots',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
      price: 12,
      weight: 12,
    } as ItemSchema;

    const baseItem2: ItemSchema = {
      id: 'potion-of-health',
      name: 'Potion of Health',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/3/32/TESV_HealthPotion.png/revision/latest?cb=20131209201729',
      effectValue: 67,
      type: 'consumable',
      consumableType: 'hp-potion',
      price: 67,
      weight: 0,
    } as ItemSchema;

    mockItem1 = ItemMapper.toDomain(baseItem1, mockUser);
    mockItem2 = ItemMapper.toDomain(baseItem2, mockUser);
    mockItems = [mockItem1, mockItem2];
  });

  it('should be defined', () => {
    expect(getUserInventoryQuery).toBeDefined();
  });

  it('should return he all user items list when the filter is all', async () => {
    const inventoryItem1 = InventoryItemMapper.toDomain(
      { amount: 2 },
      {
        item: mockItem1,
      },
    );
    const inventoryItem2 = InventoryItemMapper.toDomain(
      { amount: 1 },
      {
        item: mockItem2,
      },
    );

    const mockInventory = [inventoryItem1, inventoryItem2];

    mockUser.$watchedRelations.inventory.add(inventoryItem1);
    mockUser.$watchedRelations.inventory.add(inventoryItem2);

    vi.spyOn(inventoryRepository, 'findByUserIdAndType').mockReturnValue(
      Promise.resolve(mockInventory as any),
    );

    const type = 'all';

    const query = GetUserInventoryQuery.create({
      type,
      userId: mockUser.id,
    });

    // Act
    const result = await getUserInventoryQuery.execute(query);

    // Assert
    expect(inventoryRepository.findByUserIdAndType).toHaveBeenCalled();
    expect(inventoryRepository.findByUserIdAndType).toHaveBeenCalledWith(
      mockUser.id,
      type,
    );
    expect(result).toHaveLength(2);
  });

  it('should return the filtered user items list', async () => {
    const inventoryItem1 = InventoryItemMapper.toDomain(
      { amount: 2 },
      {
        item: mockItem1,
      },
    );

    mockUser.$watchedRelations.inventory.add(inventoryItem1);
    vi.spyOn(inventoryRepository, 'findByUserIdAndType').mockReturnValue(
      Promise.resolve([inventoryItem1] as any),
    );

    const type = 'apparel';

    const query = GetUserInventoryQuery.create({
      type,
      userId: mockUser.id,
    });

    // Act
    const result = await getUserInventoryQuery.execute(query);

    // Assert
    expect(inventoryRepository.findByUserIdAndType).toHaveBeenCalled();
    expect(inventoryRepository.findByUserIdAndType).toHaveBeenCalledWith(
      mockUser.id,
      type,
    );
    expect(result).toHaveLength(1);
    expect(result[0].itemId).toEqual(mockItem1.id);
  });
});
