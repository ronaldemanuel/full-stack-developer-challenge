import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import type { ItemProps } from '@nx-ddd/item-domain';
import {
  ItemInMemoryRepository,
  ItemMapper,
  ItemRepository,
  UserItemRefFactory,
} from '@nx-ddd/item-domain';

import { GetUserInventoryQuery } from '../../get-user-inventory.query.js';

describe('GetUserInventoryQuery', () => {
  let getUserInventoryQuery: GetUserInventoryQuery.Handler;
  let itemRepository: ItemRepository.Repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [
        GetUserInventoryQuery.Handler,
        {
          provide: ItemRepository.TOKEN,
          useClass: ItemInMemoryRepository,
        },
      ],
    }).compile();

    getUserInventoryQuery = moduleRef.get<GetUserInventoryQuery.Handler>(
      GetUserInventoryQuery.Handler,
    );
    itemRepository = moduleRef.get<ItemRepository.Repository>(
      ItemRepository.TOKEN,
    );
  });

  it('should be defined', () => {
    expect(getUserInventoryQuery).toBeDefined();
  });

  it('should return a user items list', async () => {
    // Arrange
    const mockUser = UserItemRefFactory();

    const baseItem: ItemProps = {
      id: 'dragonscale-boots',
      name: 'Dragon Boots',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    } as ItemProps;

    const baseItem2: ItemProps = {
      id: 'leather-armor',
      name: 'Leather Armor',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/e/e2/Leather_Armor_%28Armor_Piece%29.png/revision/latest?cb=20180219152808',

      type: 'apparel',
    } as ItemProps;

    const mockItem1 = ItemMapper.toDomain(baseItem, mockUser);
    const mockItem2 = ItemMapper.toDomain(baseItem2, mockUser);
    const mockItems = [mockItem1, mockItem2];

    vi.spyOn(itemRepository, 'findByUserId').mockReturnValue(
      Promise.resolve(mockItems as any),
    );

    const query = GetUserInventoryQuery.create({
      userId: mockUser.id,
    });

    // Act
    const result = await getUserInventoryQuery.execute(query);

    // Assert
    expect(itemRepository.findByUserId).toHaveBeenCalled();
    expect(itemRepository.findByUserId).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(mockItems);
  });
});
