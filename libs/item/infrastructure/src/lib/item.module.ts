import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { ItemApplicationModule } from '@nx-ddd/item-application';
import { InventoryRepository, ItemRepository } from '@nx-ddd/post-domain';
import { ItemTrpcController } from '@nx-ddd/post-presentation';
import { UserModule } from '@nx-ddd/user-infrastructure';

import { InventoryDrizzleRepository } from './database/drizzle/repositories/inventory-drizzle.repository';
import { InMemoryItemRepository } from './database/in-memory/repositories/in-memory-item.repository';

const providers: Provider[] = [
  {
    provide: ItemRepository.TOKEN,
    useClass: InMemoryItemRepository, // Assuming you have a concrete implementation of the repository
  },
  {
    provide: InventoryRepository.TOKEN,
    useClass: InventoryDrizzleRepository, // Assuming you have a concrete implementation of the repository
  },
];

const imports = [UserModule];

@Module({
  imports: [
    {
      module: ItemApplicationModule,
      providers: providers,
      imports: imports,
    },
    ...imports,
  ],
  providers: [...providers, ItemTrpcController],
  exports: [ItemRepository.TOKEN, InventoryRepository.TOKEN], // Assuming],
})
export class ItemModule {}
