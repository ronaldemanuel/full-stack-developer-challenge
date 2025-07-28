import { Module } from '@nestjs/common';

import { commands } from './commands/index.js';
import { queries } from './queries/index.js';
import { AddItemToInventoryUseCase } from './use-cases/add-item-to-inventory.use-case.js';
import { ListAllItemsUseCase } from './use-cases/list-all-items.use-case.js';
import { ListUserInventoryUseCase } from './use-cases/list-user-inventory.use-case.js';
import { UseItemUseCase } from './use-cases/use-item.use-case.js';

@Module({
  providers: [
    ...commands,
    ...queries,
    UseItemUseCase.UseCase,
    AddItemToInventoryUseCase.UseCase,
    ListUserInventoryUseCase.UseCase,
    ListAllItemsUseCase.UseCase,
  ],
  exports: [
    UseItemUseCase.UseCase,
    AddItemToInventoryUseCase.UseCase,
    ListUserInventoryUseCase.UseCase,
    ListAllItemsUseCase.UseCase,
  ],
})
export class ItemApplicationModule {}
