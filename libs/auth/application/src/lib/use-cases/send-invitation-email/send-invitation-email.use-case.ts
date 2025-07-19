import type { IUseCase } from '@nx-ddd/shared-application';
import type { SendInvitationEmailPayload } from '@nx-ddd/email-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';
import type { EventBus } from '@nestjs/cqrs';

export namespace SendInvitationEmailUseCase {
  export type Input = SendInvitationEmailPayload;
  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private readonly eventBus: EventBus) {}

    async execute(input: Input): Promise<Output> {
      const event = new SendEmailEvent('sendInvitationEmail', {
        data: input,
        to: input.email,
      });
      await this.eventBus.publish(event);
    }
  }
}
