import type { IEvent, IEventPublisher } from '@nestjs/cqrs';
import type { Inngest } from 'inngest';
import { Injectable, Logger } from '@nestjs/common';

import { EventTypes } from '@nx-ddd/jobs-events-domain';

@Injectable()
export class HttpInngestEventPublisher implements IEventPublisher {
  private readonly logger = new Logger(HttpInngestEventPublisher.name);

  constructor(public readonly inngest: Inngest) {}

  async publish<T extends IEvent>(event: any): Promise<void> {
    try {
      console.log(event);

      const teste = await this.inngest.send({
        name: EventTypes.SEND_EMAIL,
        data: event.data.data,
        id: event.id,
      });

      console.log(teste);

      this.logger.debug(
        `Inngest event published: ${event.id}`,
        JSON.stringify(event.data.data),
      );
    } catch (error) {
      this.logger.error('Failed to publish event to Inngest', error);
    }
  }
}
