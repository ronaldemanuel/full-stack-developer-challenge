import { Inject } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import type { SendMagicLinkPayload } from '@nx-ddd/email-domain';
import type { IUseCase } from '@nx-ddd/shared-application';
import { SendEmailEvent } from '@nx-ddd/email-domain';

export namespace SendMagicLinkUseCase {
  export type Input = SendMagicLinkPayload;
  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      @Inject(EventBus)
      private readonly eventBus: EventBus,
    ) {}

    async execute(input: Input): Promise<Output> {
      const event = new SendEmailEvent('sendMagicLink', {
        data: input,
        to: input.user.email,
      });
      await this.eventBus.publish(event);
    }
  }
}
