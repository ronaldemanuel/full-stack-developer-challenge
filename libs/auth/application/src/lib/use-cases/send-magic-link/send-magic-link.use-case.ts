import type { IUseCase } from '@nx-ddd/shared-application';
import {
  SendEmailEvent,
  type SendMagicLinkPayload,
} from '@nx-ddd/email-domain';
import type { EventBus } from '@nestjs/cqrs';

export namespace SendMagicLinkUseCase {
  export type Input = SendMagicLinkPayload;
  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private readonly eventBus: EventBus) {}

    async execute(input: Input): Promise<Output> {
      const event = new SendEmailEvent('sendMagicLink', {
        data: input,
        to: input.user.email,
      });
      await this.eventBus.publish(event);
    }
  }
}
