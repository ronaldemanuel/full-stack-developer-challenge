import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { ItemApplicationModule } from '@nx-ddd/item-application';
import { ItemRepository } from '@nx-ddd/post-domain';
import { ItemTrpcController } from '@nx-ddd/post-presentation';

import { ItemDrizzleRepository } from './database/drizzle/repositories/item-drizzle.repository.js';

const providers: Provider[] = [
  {
    provide: ItemRepository.TOKEN,
    useClass: ItemDrizzleRepository, // Assuming you have a concrete implementation of the repository
  },
];

@Module({
  imports: [
    {
      module: ItemApplicationModule,
      providers: providers,
    },
  ],
  providers: [...providers, ItemTrpcController],
  exports: [ItemRepository.TOKEN],
})
export class ItemModule {}
