import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import type { UserEntityPostRef } from '@nx-ddd/post-domain';
import type { IUseCase } from '@nx-ddd/shared-application';
import { Cacheable } from '@nx-ddd/shared-application';

import { GetPostByIdQuery } from '../queries/index.js';

export namespace GetPostByIdUseCase {
  export type Input = GetPostByIdQuery.Input & {
    user?: UserEntityPostRef;
  };
  export type Output = GetPostByIdQuery.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(QueryBus)
      private readonly queryBus: QueryBus,
    ) {}

    @Cacheable({
      key: (input: Input) => `posts::${input.id}`,
      ttl: 1000 * 60 * 60, // 1 hour
    })
    execute(input: Input): Output | Promise<Output> {
      return this.queryBus.execute<
        GetPostByIdQuery.Input,
        GetPostByIdQuery.Output
      >(GetPostByIdQuery.create(input, input.user));
    }
  }
}
