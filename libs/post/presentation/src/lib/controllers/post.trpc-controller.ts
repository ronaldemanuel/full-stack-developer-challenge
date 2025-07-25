import { Inject } from '@nestjs/common';

import type { inferProcedureBuilderResolverContext } from '@nx-ddd/shared-presentation';
import {
  createPostInputSchema,
  CreatePostUseCase,
  deletePostInputSchema,
  DeletePostUseCase,
  getPostByIdInputSchema,
  GetPostByIdUseCase,
  searchPostsInputSchema,
  SearchPostsUseCase,
} from '@nx-ddd/post-application';
import { UserEntityPostRef } from '@nx-ddd/post-domain';
import {
  createNestjsTrpcRouter,
  Ctx,
  Input,
  protectedProcedure,
  publicProcedure,
} from '@nx-ddd/shared-presentation';

export class PostTrpcController {
  @Inject(CreatePostUseCase.UseCase)
  private readonly createPostUseCase!: CreatePostUseCase.UseCase;
  @Inject(GetPostByIdUseCase.UseCase)
  private readonly getPostByIdUseCase!: GetPostByIdUseCase.UseCase;
  @Inject(SearchPostsUseCase.UseCase)
  private readonly searchPostsUseCase!: SearchPostsUseCase.UseCase;
  @Inject(DeletePostUseCase.UseCase)
  private readonly deletePostUseCase!: DeletePostUseCase.UseCase;

  search(
    @Input()
    input: SearchPostsUseCase.Input,
  ) {
    return this.searchPostsUseCase.execute(input);
  }

  getById(
    @Input()
    input: GetPostByIdUseCase.Input,
  ) {
    return this.getPostByIdUseCase.execute(input);
  }

  delete(
    @Input()
    input: DeletePostUseCase.Input,
  ) {
    return this.deletePostUseCase.execute(input);
  }

  create(
    @Input()
    input: Omit<CreatePostUseCase.Input, 'user'>,
    @Ctx()
    ctx: inferProcedureBuilderResolverContext<typeof protectedProcedure>,
  ) {
    return this.createPostUseCase.execute({
      ...input,
      user: UserEntityPostRef.cast(ctx.session.user),
    });
  }
}

export const postsRouter = createNestjsTrpcRouter(
  PostTrpcController,
  (adapter) => {
    return {
      search: publicProcedure
        .input(searchPostsInputSchema)
        .query(adapter.adaptMethod('search')),
      getById: publicProcedure
        .input(getPostByIdInputSchema)
        .query(adapter.adaptMethod('getById')),
      delete: protectedProcedure
        .input(deletePostInputSchema)
        .mutation(adapter.adaptMethod('delete')),
      create: protectedProcedure
        .input(createPostInputSchema)
        .mutation(adapter.adaptMethod('create')),
    };
  },
);
