import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import type { ConsumableItemProps, UserItemRef } from '@nx-ddd/item-domain';
import {
  InventoryInMemoryRepository,
  InventoryItemMapper,
  InventoryRepository,
  ItemMapper,
  UserItemRefFactory,
} from '@nx-ddd/item-domain';

import { UseItemCommand } from '../../use-item.command.js';

describe('UseItemCommand.Handler', () => {
  let handler: UseItemCommand.Handler;
  let inventoryRepository: InventoryRepository.Repository;

  let character: UserItemRef;
  let item: ReturnType<typeof ItemMapper.toDomain>;
  let inventoryItem: ReturnType<typeof InventoryItemMapper.toDomain>;

  const baseItem: ConsumableItemProps = {
    id: 'healing-potion',
    name: 'Poção de Cura',
    type: 'consumable',
  } as ConsumableItemProps;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UseItemCommand.Handler,
        {
          provide: InventoryRepository.TOKEN,
          useClass: InventoryInMemoryRepository,
        },
      ],
    }).compile();

    handler = module.get(UseItemCommand.Handler);
    inventoryRepository = module.get(InventoryRepository.TOKEN);

    character = UserItemRefFactory({}, {}, 'user-123');

    item = ItemMapper.toDomain(baseItem, character);
    item.use = vi.fn(); // mocka uso do item
    item.commit = vi.fn(); // mocka commit de eventos

    inventoryItem = InventoryItemMapper.toDomain({}, { character, item });

    // preenche o inventário
    await inventoryRepository.update([inventoryItem]);
  });

  it('deve usar o item corretamente', async () => {
    const command = UseItemCommand.create({
      userId: character.id,
      itemId: item.id,
    });

    await handler.execute(command);

    expect(item.use).toHaveBeenCalled();
    expect(item.commit).toHaveBeenCalled();
  });

  it('deve lançar erro se o item não for encontrado', async () => {
    const command = UseItemCommand.create({
      userId: character.id,
      itemId: 'item-inexistente',
    });

    await expect(handler.execute(command)).rejects.toThrow(
      'Item não encontrado no inventário',
    );
  });
});
