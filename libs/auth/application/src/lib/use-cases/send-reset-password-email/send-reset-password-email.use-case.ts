import type { IUseCase } from '@nx-ddd/shared-application';
import type { SendResetPasswordPayload } from '@nx-ddd/email-domain';
import { SendEmailEvent } from '@nx-ddd/email-domain';
import type { EventBus } from '@nestjs/cqrs';

export namespace SendResetPasswordUseCase {
  export type Input = SendResetPasswordPayload;
  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(private readonly eventBus: EventBus) {}

    async execute(input: Input): Promise<Output> {
      const event = new SendEmailEvent('sendResetPassword', {
        data: input,
        to: input.user.email,
      });
      await this.eventBus.publish(event);
    }
  }
}
