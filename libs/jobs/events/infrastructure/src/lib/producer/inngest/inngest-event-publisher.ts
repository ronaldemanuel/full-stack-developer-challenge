import type { IEventPublisher } from '@nestjs/cqrs';
import type { Inngest } from 'inngest';
import { Injectable, Logger } from '@nestjs/common';

import type { IEvent } from '@nx-ddd/jobs-events-domain';

@Injectable()
export class HttpInngestEventPublisher implements IEventPublisher<IEvent> {
  private readonly logger = new Logger(HttpInngestEventPublisher.name);

  constructor(public readonly inngest: Inngest) {}

  async publish<T extends IEvent>(event: T): Promise<void> {
    try {
      await this.inngest.send({
        name: event.identifier,
        data: event,
      });

      this.logger.debug(
        `Inngest event published: ${event.identifier}`,
        JSON.stringify(event),
      );
    } catch (error) {
      this.logger.error('Failed to publish event to Inngest', error);
    }
  }
}
