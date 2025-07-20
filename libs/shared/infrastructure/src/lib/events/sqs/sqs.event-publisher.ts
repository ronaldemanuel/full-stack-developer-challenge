import { Injectable } from '@nestjs/common';
import type { AsyncContext, IEventPublisher } from '@nestjs/cqrs';
import type { IEvent } from '@nx-ddd/shared-domain';
import { SendMessageCommand, type SQSClient } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsEventPubSubBus implements IEventPublisher<IEvent> {
  constructor(private sqs: SQSClient) {}

  publish<TEvent extends IEvent>(
    event: TEvent,
    dispatcherContext?: unknown,
    asyncContext?: AsyncContext
  ) {
    const [namespace, eventName] = event.identifier.split('/');
    this.sqs.send(
      new SendMessageCommand({
        QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${namespace}`,
        MessageBody: JSON.stringify({
          eventName,
          data: event,
          dispatcherContext,
          asyncContext,
        }),
      })
    );
  }
}
