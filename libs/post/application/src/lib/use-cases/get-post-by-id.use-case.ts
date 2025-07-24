import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import type { IUseCase } from '@nx-ddd/shared-application';

import { GetPostByIdQuery } from '../queries/index.js';

export namespace GetPostByIdUseCase {
  export type Input = GetPostByIdQuery.Output;
  export type Output = GetPostByIdQuery.Output;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(QueryBus)
      private readonly queryBus: QueryBus,
    ) {}

    execute(input: Input): Output | Promise<Output> {
      return this.queryBus.execute<
        GetPostByIdQuery.Input,
        GetPostByIdQuery.Output
      >(GetPostByIdQuery.create(input));
    }
  }
}
