import type {
  TransactionalAdapter,
  TransactionalOptionsAdapterFactory,
} from '@nestjs-cls/transactional';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';

import type {
  ConsumableItemProps,
  InventoryItemEntity,
  ItemSchema,
  UserItemRef,
} from '@nx-ddd/item-domain';
import { DATABASE_CONNECTION_NAME } from '@nx-ddd/database-application';
import {
  InventoryInMemoryRepository,
  InventoryItemMapper,
  InventoryRepository,
  ItemInMemoryRepository,
  ItemMapper,
  ItemRepository,
  UserItemRefFactory,
} from '@nx-ddd/item-domain';
import { UserInMemoryRepository, UserRepository } from '@nx-ddd/user-domain';

import { AddItemToInventoryCommand } from '../../add-item-to-inventory.command';

class StubAdapter implements TransactionalAdapter<any, any, any> {
  connectionToken?: any;
  connection?: any;
  defaultTxOptions?: Partial<any> | undefined;
  optionsFactory: TransactionalOptionsAdapterFactory<any, any, any> = () => {
    return {
      getFallbackInstance() {
        return {};
      },
      wrapWithTransaction(options, fn, setTx) {
        return fn();
      },
      wrapWithNestedTransaction(options, fn, setTx, tx) {
        return fn();
      },
    };
  };
}
describe('UseItemCommand', () => {
  let addItemToInventoryCommand: AddItemToInventoryCommand.Handler;
  let itemRepository: ItemRepository.Repository;
  let userRepository: UserRepository.Repository;
  let inventoryRepository: InventoryRepository.Repository;
  let coinInventoryItem: InventoryItemEntity;
  let mockUser: UserItemRef;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClsModule.forRoot({
          plugins: [
            new ClsPluginTransactional({
              connectionName: DATABASE_CONNECTION_NAME,
              enableTransactionProxy: true,
              adapter: new StubAdapter(),
              imports: [],
            }),
          ],
        }),
        CqrsModule.forRoot(),
      ],
      controllers: [],
      providers: [
        AddItemToInventoryCommand.Handler,
        {
          provide: ItemRepository.TOKEN,
          useClass: ItemInMemoryRepository,
        },
        {
          provide: UserRepository.TOKEN,
          useClass: UserInMemoryRepository,
        },
        {
          provide: InventoryRepository.TOKEN,
          useClass: InventoryInMemoryRepository,
        },
      ],
    }).compile();

    addItemToInventoryCommand =
      moduleRef.get<AddItemToInventoryCommand.Handler>(
        AddItemToInventoryCommand.Handler,
      );
    itemRepository = moduleRef.get<ItemRepository.Repository>(
      ItemRepository.TOKEN,
    );
    userRepository = moduleRef.get<UserRepository.Repository>(
      UserRepository.TOKEN,
    );
    inventoryRepository = moduleRef.get<InventoryRepository.Repository>(
      InventoryRepository.TOKEN,
    );

    const baseCoin: ConsumableItemProps = {
      id: 'coin',
      name: 'Coin',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/5/55/Septim_Skyrim.png/revision/latest?cb=20120311100037',
      type: 'misc',
      price: 0,
      weight: 0.1,
    } as ConsumableItemProps;

    const coin = ItemMapper.toDomain(baseCoin);
    coinInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1000 },
      { item: coin },
    );

    mockUser = UserItemRefFactory({}, { inventory: [coinInventoryItem] });
  });

  it('should be defined', () => {
    expect(addItemToInventoryCommand).toBeDefined();
  });

  it('should add item to inventory', async () => {
    // Arrange

    const baseItem: ItemSchema = {
      id: 'dragonscale-boots',
      name: 'Dragon Boots',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    } as ItemSchema;
    const mockItem = ItemMapper.toDomain(baseItem);

    // Create spies on the user methods
    const useItemSpy = vi.spyOn(mockUser, 'addItemToInventory');

    vi.spyOn(mockItem, 'commit');

    vi.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

    vi.spyOn(itemRepository, 'findById').mockImplementation(async () => {
      return mockItem as any;
    });

    vi.spyOn(inventoryRepository, 'syncByUser').mockResolvedValue(undefined);

    vi.spyOn(inventoryRepository, 'findByUserId').mockResolvedValue([
      coinInventoryItem,
    ]);

    const command = AddItemToInventoryCommand.create(
      {
        itemId: mockItem.id,
      },
      mockUser,
    );

    // Act
    await addItemToInventoryCommand.execute(command);

    // Assert
    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(itemRepository.findById).toHaveBeenCalledWith(mockItem.id);
    expect(inventoryRepository.findByUserId).toHaveBeenCalledWith(mockUser.id);
    expect(useItemSpy).toHaveBeenCalledWith(mockItem);
    expect(inventoryRepository.syncByUser).toHaveBeenCalledWith(mockUser);
    expect(mockItem.commit).toHaveBeenCalled();
    expect(mockUser.inventory).toHaveLength(2);
  });

  it('should not add item if it no enough coins', async () => {
    // Arrange

    const baseItem: ItemSchema = {
      id: 'dragonscale-boots',
      name: 'Dragon Boots',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
      price: 2000,
    } as ItemSchema;
    const mockItem = ItemMapper.toDomain(baseItem);
    const mockInventoryItem = InventoryItemMapper.toDomain(
      { amount: 1 },
      { character: mockUser, item: mockItem },
    );

    const mockInventory = [mockInventoryItem, coinInventoryItem];

    // Create spies on the user methods
    vi.spyOn(mockItem, 'commit');

    vi.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

    vi.spyOn(itemRepository, 'findById').mockImplementation(async () => {
      return mockItem as any;
    });

    vi.spyOn(inventoryRepository, 'syncByUser').mockResolvedValue(undefined);

    vi.spyOn(inventoryRepository, 'findByUserId').mockResolvedValue(
      mockInventory,
    );

    const command = AddItemToInventoryCommand.create(
      {
        itemId: mockItem.id,
      },
      mockUser,
    );

    // Assert
    expect(async () => {
      await addItemToInventoryCommand.execute(command);
    }).rejects.toThrow('No enough coins');
  });
});
