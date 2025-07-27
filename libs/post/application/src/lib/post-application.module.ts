import { Module } from '@nestjs/common';

import { commands } from './commands/index';
import { queries } from './queries/index';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  GetPostByIdUseCase,
  SearchPostsUseCase,
} from './use-cases/index';
import { ToggleLikeUseCase } from './use-cases/toggle-like.use-case';

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
