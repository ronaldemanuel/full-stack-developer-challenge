import type {
  TransactionalAdapter,
  TransactionalOptionsAdapterFactory,
} from '@nestjs-cls/transactional';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';

import type { ItemSchema } from '@nx-ddd/item-domain';
import { DATABASE_CONNECTION_NAME } from '@nx-ddd/database-application';
import {
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
  });

  it('should be defined', () => {
    expect(addItemToInventoryCommand).toBeDefined();
  });

  it('should add item to inventory', async () => {
    // Arrange
    const mockUser = UserItemRefFactory(undefined);

    const baseItem: ItemSchema = {
      id: 'dragonscale-boots',
      name: 'Dragon Boots',
      type: 'apparel',
      image:
        'https://static.wikia.nocookie.net/elderscrolls/images/f/fb/Dragonscale_Helmet.png/revision/latest?cb=20170829115636',
    } as ItemSchema;
    const mockItem = ItemMapper.toDomain(baseItem, mockUser);

    // Create spies on the user methods
    const useItemSpy = vi.spyOn(mockUser, 'addItemToInventory');

    vi.spyOn(mockItem, 'commit');

    vi.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

    vi.spyOn(itemRepository, 'findById').mockImplementation(async () => {
      return mockItem as any;
    });

    vi.spyOn(itemRepository, 'update').mockResolvedValue(undefined);

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
    expect(useItemSpy).toHaveBeenCalledWith(mockItem);
    expect(itemRepository.update).toHaveBeenCalledWith(mockItem);
    expect(mockItem.commit).toHaveBeenCalled();
  });
});
