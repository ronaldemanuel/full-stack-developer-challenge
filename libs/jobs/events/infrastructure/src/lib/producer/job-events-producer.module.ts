import type { DynamicModule } from '@nestjs/common';
import type { IEventPublisher } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';

import type { IEvent } from '@nx-ddd/jobs-events-domain';
import { inngest } from '@nx-ddd/jobs-events-presentation';

import { SQSClientProxy } from './aws/sqs-client.proxy';
import { HttpInngestEventPublisher } from './inngest/inngest-event-publisher';
import { MicroserviceEventPubSubBus } from './microservice.event-publisher';

@Module({})
export class JobEventsProducerModule {
  static forRoot() {
    const isAws = process.env.NEXT_APPS_PROVIDER === 'aws';

    if (isAws) {
      return this.forAws();
    } else {
      return this.forVercel();
    }
  }
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

  static forVercel(): DynamicModule {
    return CqrsModule.forRootAsync({
      async useFactory(): Promise<{ eventPublisher: IEventPublisher<IEvent> }> {
        const publisher = new HttpInngestEventPublisher(inngest);

        return {
          eventPublisher: publisher,
        };
      },
    });
  }
}
