import { Injectable } from '@nestjs/common';
import type { IEventPublisher } from '@nestjs/cqrs';
import type { ClientProxy } from '@nestjs/microservices';
import type { IEvent } from '@nx-ddd/job-events-domain';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MicroserviceEventPubSubBus implements IEventPublisher<IEvent> {
  constructor(private readonly proxy: ClientProxy) {}

  publish<TEvent extends IEvent>(event: TEvent, dispatcherContext?: unknown) {
    return firstValueFrom(
      this.proxy.send(event.identifier, {
        data: event,
        ctx: dispatcherContext,
      })
    );
  }
}
