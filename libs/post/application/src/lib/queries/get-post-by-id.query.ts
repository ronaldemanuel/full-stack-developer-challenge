import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { Validated } from 'validated-extendable';

import type { PostEntity } from '@nx-ddd/post-domain';
import { PostRepository } from '@nx-ddd/post-domain';
import { InjectRepository } from '@nx-ddd/shared-domain';

import type { GetPostByIdInput } from '../schemas/queries.js';
import { getPostByIdInputSchema } from '../schemas/queries.js';

export namespace GetPostByIdQuery {
  export type Input = GetPostByIdInput;
  export type Output = PostEntity;

  class GetPostByIdQuery extends Validated(getPostByIdInputSchema) {}

  export function create(data: Input) {
    return new GetPostByIdQuery(data);
  }

  @QueryHandler(GetPostByIdQuery)
  export class Handler implements IQueryHandler<GetPostByIdQuery, Output> {
    constructor(
      @InjectRepository(PostRepository.TOKEN)
      private readonly postRepository: PostRepository.Repository,
    ) {}

    async execute(query: GetPostByIdQuery): Promise<Output> {
      return this.postRepository.findById(query.id);
    }
  }
}
