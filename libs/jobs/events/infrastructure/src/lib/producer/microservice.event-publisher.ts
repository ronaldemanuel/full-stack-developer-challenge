import type { IEventPublisher } from '@nestjs/cqrs';
import type { ClientProxy } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import type { IEvent } from '@nx-ddd/jobs-events-domain';

@Injectable()
export class MicroserviceEventPubSubBus implements IEventPublisher<IEvent> {
  constructor(private readonly proxy: ClientProxy) {}

  publish<TEvent extends IEvent>(event: TEvent, dispatcherContext?: unknown) {
    return firstValueFrom(
      this.proxy.emit(event.identifier, {
        data: event,
        ctx: dispatcherContext,
      }),
    );
  }
}
