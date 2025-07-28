import { Module } from '@nestjs/common';

import { commands } from './commands/index.js';
import { queries } from './queries/index.js';
import { UseItemUseCase } from './use-cases/use-item.use-case.js';

@Module({
  providers: [...commands, ...queries, UseItemUseCase.UseCase],
  exports: [UseItemUseCase.UseCase],
})
export class ItemApplicationModule {}
