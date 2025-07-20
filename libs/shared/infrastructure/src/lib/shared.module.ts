import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SqsEventPubSubBus } from './events/sqs/sqs.event-publisher.js';
import type { IEvent } from '@nx-ddd/shared-domain';
import type { IEventPublisher } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule.forRootAsync({
      useFactory(eventPublisher: IEventPublisher<IEvent>) {
        return {
          eventPublisher,
        };
      },
      inject: ['IEventPublisher'],
      extraProviders: [
        {
          provide: 'IEventPublisher',
          useClass: SqsEventPubSubBus, // Ensure this is the correct import path for your SqsEventPubSubBus
        },
      ],
    }),
  ],
})
export class SharedModule {}
