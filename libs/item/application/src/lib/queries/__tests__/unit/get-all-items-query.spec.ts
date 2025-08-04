import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import type {
  InventoryItemEntity,
  ItemEntity,
  ItemSchema,
  UserItemRef,
} from '@nx-ddd/item-domain';
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
  let mockUser: UserItemRef;

  let mockItem1: ItemEntity;
  let mockItem2: ItemEntity;

  let mockItems: ItemEntity[];

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
    expect(getAllItemsQuery).toBeDefined();
  });

  it('should return the all items list when the filter is all ', async () => {
    vi.spyOn(itemRepository, 'findAll').mockReturnValue(
      Promise.resolve(mockItems as any),
    );

    const query = GetAllItemsQuery.create({ type: 'all' });

    // Act
    const result = await getAllItemsQuery.execute(query);

    // Assert
    expect(itemRepository.findAll).toHaveBeenCalled();
    expect(itemRepository.findAll).toHaveBeenCalledWith();
    expect(result).toEqual(mockItems);
  });

  it('should return the filtered items list', async () => {
    vi.spyOn(itemRepository, 'findByType').mockReturnValue(
      Promise.resolve([mockItem1] as any),
    );

    const type = 'apparel';

    const query = GetAllItemsQuery.create({ type });

    // Act
    const result = await getAllItemsQuery.execute(query);

    // Assert
    expect(itemRepository.findByType).toHaveBeenCalled();
    expect(itemRepository.findByType).toHaveBeenCalledWith(type);
    expect(result).toEqual([mockItem1]);
  });
});
