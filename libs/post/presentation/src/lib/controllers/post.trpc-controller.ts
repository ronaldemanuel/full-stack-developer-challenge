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
  toggleLikeInputSchema,
  ToggleLikeUseCase,
} from '@nx-ddd/post-application';
import { UserEntityPostRef } from '@nx-ddd/post-domain';
import {
  createNestjsTrpcRouter,
  Ctx,
  Input,
  protectedProcedure,
  publicProcedure,
} from '@nx-ddd/shared-presentation';

import { getPostByIdPresentationOutputSchema } from '../schemas/output.js';

export class PostTrpcController {
  @Inject(CreatePostUseCase.UseCase)
  private readonly createPostUseCase!: CreatePostUseCase.UseCase;
  @Inject(GetPostByIdUseCase.UseCase)
  private readonly getPostByIdUseCase!: GetPostByIdUseCase.UseCase;
  @Inject(SearchPostsUseCase.UseCase)
  private readonly searchPostsUseCase!: SearchPostsUseCase.UseCase;
  @Inject(DeletePostUseCase.UseCase)
  private readonly deletePostUseCase!: DeletePostUseCase.UseCase;
  @Inject(ToggleLikeUseCase.UseCase)
  private readonly toggleLikeUseCase!: ToggleLikeUseCase.UseCase;

  search(
    @Input()
    input: SearchPostsUseCase.Input,
  ) {
    return this.searchPostsUseCase.execute(input);
  }

  async getById(
    @Input()
    input: GetPostByIdUseCase.Input,
    @Ctx() ctx: inferProcedureBuilderResolverContext<typeof publicProcedure>,
  ) {
    const data = await this.getPostByIdUseCase.execute({
      ...input,
      user:
        ctx.session && ctx.session.user
          ? UserEntityPostRef.cast(ctx.session?.user)
          : undefined,
    });
    return data;
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

  toggleLike(
    @Input()
    input: ToggleLikeUseCase.Input,
    @Ctx()
    ctx: inferProcedureBuilderResolverContext<typeof protectedProcedure>,
  ) {
    return this.toggleLikeUseCase.execute({
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
        .output(getPostByIdPresentationOutputSchema)
        .query(adapter.adaptMethod('getById')),
      delete: protectedProcedure
        .input(deletePostInputSchema)
        .mutation(adapter.adaptMethod('delete')),
      create: protectedProcedure
        .input(createPostInputSchema)
        .mutation(adapter.adaptMethod('create')),
      toggleLike: protectedProcedure
        .input(
          toggleLikeInputSchema.omit({
            userId: true, // userId is derived from the session
          }),
        )
        .mutation(adapter.adaptMethod('toggleLike')),
    };
  },
);
