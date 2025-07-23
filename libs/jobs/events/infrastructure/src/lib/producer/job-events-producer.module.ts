import type { IEventPublisher } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';

import type { IEvent } from '@nx-ddd/job-events-domain';

import { SQSClientProxy } from './aws/sqs-client.proxy.js';
import { MicroserviceEventPubSubBus } from './microservice.event-publisher.js';

@Module({})
export class JobEventsProducerModule {
  static forAws() {
    return CqrsModule.forRootAsync({
      useFactory(sqs: SQSClientProxy) {
        const eventPublisher = new MicroserviceEventPubSubBus(
          sqs,
        ) as IEventPublisher<IEvent>;

        return {
          eventPublisher,
        };
      },
      inject: ['SQS_CLIENT'],
      imports: [
        ClientsModule.register([
          {
            name: 'SQS_CLIENT',
            customClass: SQSClientProxy,
          },
        ]),
      ],
    });
  }
}
