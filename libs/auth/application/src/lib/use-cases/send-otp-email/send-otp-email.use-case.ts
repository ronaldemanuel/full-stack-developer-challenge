import { Inject } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import type { SendOTPEmailPayload } from '@nx-ddd/email-domain';
import type { IUseCase } from '@nx-ddd/shared-application';
import { SendEmailEvent } from '@nx-ddd/email-domain';

export namespace SendOTPEmailUseCase {
  export type Input = SendOTPEmailPayload;
  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(EventBus)
      private readonly eventBus: EventBus,
    ) {}

    async execute(input: Input): Promise<Output> {
      const event = new SendEmailEvent('sendOTPEmail', {
        data: input,
        to: input.email,
      });
      await this.eventBus.publish(event);
    }
  }
}
