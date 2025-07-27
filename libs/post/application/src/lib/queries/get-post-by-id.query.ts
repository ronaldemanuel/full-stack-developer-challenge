import type { IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { UserEntityPostRef } from '@nx-ddd/post-domain';
import { PostRepository } from '@nx-ddd/post-domain';

import type { GetPostByIdInput, GetPostByIdOutput } from '../schemas/queries';
import { getPostByIdInputSchema } from '../schemas/queries';

export namespace GetPostByIdQuery {
  export type Input = GetPostByIdInput;
  export type Output = GetPostByIdOutput;

  class GetPostByIdQuery extends Validated(getPostByIdInputSchema) {
    user?: UserEntityPostRef;
    constructor(data: Input, user?: UserEntityPostRef) {
      super(data);
      this.user = user;
    }
  }

  export function create(data: Input, user?: UserEntityPostRef) {
    return new GetPostByIdQuery(data, user);
  }

  @QueryHandler(GetPostByIdQuery)
  export class Handler implements IQueryHandler<GetPostByIdQuery, Output> {
    constructor(
      @Inject(PostRepository.TOKEN)
      private readonly postRepository: PostRepository.Repository,
    ) {}

    async execute(query: GetPostByIdQuery): Promise<Output> {
      if (query.user) {
        return this.postRepository
          .findById(query.id, {
            likedByUserId: query.user.id,
          })
          .then((el) => el.toJSON());
      }

      return this.postRepository.findById(query.id).then((el) => el.toJSON());
    }
  }
}
