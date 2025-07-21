import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import type { IEventPublisher } from '@nestjs/cqrs';
import type { IEvent } from '@nx-ddd/job-events-domain';
import { MicroserviceEventPubSubBus } from './microservice.event-publisher.js';
import { ClientsModule } from '@nestjs/microservices';
import { SQSClientProxy } from './aws/sqs-client.proxy.js';

@Module({
  imports: [
    CqrsModule.forRootAsync({
      useFactory(eventPublisher: IEventPublisher<IEvent>) {
        return {
          eventPublisher,
        };
      },
      inject: ['IEventPublisher'],
      imports: [
        ClientsModule.register([
          {
            name: 'SQS_CLIENT',
            customClass: SQSClientProxy,
          },
        ]),
      ],
      extraProviders: [
        {
          provide: 'IEventPublisher',
          useFactory(sqs: SQSClientProxy) {
            return new MicroserviceEventPubSubBus(sqs);
          },
          inject: ['SQS_CLIENT'],
        },
      ],
    }),
  ],
})
export class JobEventsProducerModule {}
