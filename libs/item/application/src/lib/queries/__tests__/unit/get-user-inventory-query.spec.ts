import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import type { ItemSchema } from '@nx-ddd/item-domain';
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
  });

  it('should be defined', () => {
    expect(getUserInventoryQuery).toBeDefined();
  });

  it('should return a user items list', async () => {
    // Arrange
    const mockUser = UserItemRefFactory();

    const baseItem: ItemSchema = {
      id: 'dragonscale-boots',
      name: 'Dragon Boots',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    } as ItemSchema;

    const baseItem2: ItemSchema = {
      id: 'leather-armor',
      name: 'Leather Armor',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/e/e2/Leather_Armor_%28Armor_Piece%29.png/revision/latest?cb=20180219152808',

      type: 'apparel',
    } as ItemSchema;

    const mockItem1 = ItemMapper.toDomain(baseItem, mockUser);
    const mockItem2 = ItemMapper.toDomain(baseItem2, mockUser);

    const inventoryItemProps1 = {
      itemId: mockItem1.id,
      userId: mockUser.id,
      amount: 5,
    };

    const inventoryItemProps2 = {
      itemId: mockItem2.id,
      userId: mockUser.id,
      amount: 2,
    };

    const inventoryItem1 = InventoryItemMapper.toDomain(inventoryItemProps1, {
      item: mockItem1,
    });
    const inventoryItem2 = InventoryItemMapper.toDomain(inventoryItemProps2, {
      item: mockItem2,
    });

    const mockInventory = [inventoryItem1, inventoryItem2];
    const mockItems = [mockItem1, mockItem2];

    vi.spyOn(inventoryRepository, 'findByUserId').mockReturnValue(
      Promise.resolve(mockInventory as any),
    );

    const query = GetUserInventoryQuery.create(mockUser.toJSON());

    // Act
    const result = await getUserInventoryQuery.execute(query);

    // Assert
    expect(inventoryRepository.findByUserId).toHaveBeenCalled();
    expect(inventoryRepository.findByUserId).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(mockItems);
  });
});
