import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Session } from '@nx-ddd/auth-domain';
import type { IUseCase } from '@nx-ddd/shared-application';

export namespace GetSessionUseCase {
  type Input = undefined;
  type Output = Session | null;
  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(REQUEST)
      private readonly request: {
        session: Session | null;
      }
    ) {}

    async execute(): Promise<Output> {
      return this.request.session;
    }
  }
}
