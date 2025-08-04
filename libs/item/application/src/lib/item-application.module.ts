import { Module } from '@nestjs/common';

import { commands } from './commands/index';
import { queries } from './queries/index';
import { AddItemToInventoryUseCase } from './use-cases/add-item-to-inventory.use-case';
import { ListAllItemsUseCase } from './use-cases/list-all-items.use-case';
import { ListUserInventoryUseCase } from './use-cases/list-user-inventory.use-case';
import { UseItemUseCase } from './use-cases/use-item.use-case';

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
