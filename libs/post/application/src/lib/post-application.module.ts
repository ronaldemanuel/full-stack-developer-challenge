import { Module } from '@nestjs/common';

import { commands } from './commands/index.js';
import { queries } from './queries/index.js';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  GetPostByIdUseCase,
  SearchPostsUseCase,
} from './use-cases/index.js';

@Module({
  providers: [
    ...commands,
    ...queries,
    CreatePostUseCase.UseCase,
    DeletePostUseCase.UseCase,
    GetPostByIdUseCase.UseCase,
    SearchPostsUseCase.UseCase,
  ],
  exports: [
    CreatePostUseCase.UseCase,
    DeletePostUseCase.UseCase,
    GetPostByIdUseCase.UseCase,
    SearchPostsUseCase.UseCase,
  ],
})
export class PostApplicationModule {}
