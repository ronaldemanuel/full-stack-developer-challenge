import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import type { ItemSchema } from '@nx-ddd/item-domain';
import {
  ItemInMemoryRepository,
  ItemMapper,
  ItemRepository,
  UserItemRefFactory,
} from '@nx-ddd/item-domain';

import { GetAllItemsQuery } from '../../get-all-items.query';

describe('GetAllItemsQuery', () => {
  let getAllItemsQuery: GetAllItemsQuery.Handler;
  let itemRepository: ItemRepository.Repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [
        GetAllItemsQuery.Handler,
        {
          provide: ItemRepository.TOKEN,
          useClass: ItemInMemoryRepository,
        },
      ],
    }).compile();

    getAllItemsQuery = moduleRef.get<GetAllItemsQuery.Handler>(
      GetAllItemsQuery.Handler,
    );
    itemRepository = moduleRef.get<ItemRepository.Repository>(
      ItemRepository.TOKEN,
    );
  });

  it('should be defined', () => {
    expect(getAllItemsQuery).toBeDefined();
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
    const mockItems = [mockItem1, mockItem2];

    vi.spyOn(itemRepository, 'findAll').mockReturnValue(
      Promise.resolve(mockItems as any),
    );

    const query = GetAllItemsQuery.create({});

    // Act
    const result = await getAllItemsQuery.execute(query);

    // Assert
    expect(itemRepository.findAll).toHaveBeenCalled();
    expect(itemRepository.findAll).toHaveBeenCalledWith();
    expect(result).toEqual(mockItems);
  });
});
