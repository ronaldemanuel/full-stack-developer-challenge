import { Module } from '@nestjs/common';

import { commands } from './commands/index.js';
import { queries } from './queries/index.js';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  GetPostByIdUseCase,
  SearchPostsUseCase,
} from './use-cases/index.js';
import { ToggleLikeUseCase } from './use-cases/toggle-like.use-case.js';

@Module({
  providers: [
    ...commands,
    ...queries,
    CreatePostUseCase.UseCase,
    DeletePostUseCase.UseCase,
    GetPostByIdUseCase.UseCase,
    SearchPostsUseCase.UseCase,
    ToggleLikeUseCase.UseCase,
  ],
  exports: [
    CreatePostUseCase.UseCase,
    DeletePostUseCase.UseCase,
    GetPostByIdUseCase.UseCase,
    SearchPostsUseCase.UseCase,
    ToggleLikeUseCase.UseCase,
  ],
})
export class PostApplicationModule {}
