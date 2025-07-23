//sns-client-proxy.ts
import type { ReadPacket, WritePacket } from '@nestjs/microservices';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import type { EventQueues } from '@nx-ddd/job-events-domain';

import { env } from '../../../env.mjs';

export class SQSClientProxy extends ClientProxy {
  private readonly client: SQSClient = new SQSClient({});

  constructor() {
    super();
  }

  private readonly logger = new Logger(SQSClientProxy.name);

  override unwrap<T = SQSClient>(): T {
    return this.client as T;
  }

  async connect(): Promise<any> {
    console.log('connect');
  }

  async close() {
    console.log('close');
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    const [namespace, eventName] = packet.pattern.split('/');
    this.logger.log(`Dispatching event: ${eventName} to queue: ${namespace}`);
    const queueMap: Record<EventQueues, string> = {
      'app-queue': env.APP_QUEUE_URL,
    };

    if (!queueMap[namespace as keyof typeof queueMap]) {
      throw new Error(`Queue not found for namespace: ${namespace}`);
    }

    const queueUrl = queueMap[namespace as keyof typeof queueMap];

    await this.client.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          pattern: packet.pattern, //this is important for figuring out the handler
          event: packet.data,
          eventName, //this is the event name
        }),
      }),
    );
    this.logger.log(`Event ${eventName} dispatched to queue: ${queueUrl}`);
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ): () => void {
    console.log('message:', packet);
    //we wont be using this in event based microservices
    return () => console.log('teardown');
  }
}
