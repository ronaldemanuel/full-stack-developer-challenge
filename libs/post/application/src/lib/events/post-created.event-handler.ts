import type { IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';

import { PostCreatedEvent } from '@nx-ddd/post-domain';

export namespace PostCreatedEventHandler {
  export const TOKEN = 'PostCreatedEventHandler';

  @EventsHandler(PostCreatedEvent)
  export class Handler implements IEventHandler<PostCreatedEvent> {
    private readonly logger = new Logger('PostCreatedEventHandler');

    handle(event: PostCreatedEvent) {
      this.logger.log(
        `Post created with ID: ${event.id} and title: ${event.title}`,
      );
    }
  }
}
