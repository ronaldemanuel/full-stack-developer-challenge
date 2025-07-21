//sns-client-proxy.ts
import type { ReadPacket, WritePacket } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';
import type { SQSClient } from '@aws-sdk/client-sqs';
import { SendMessageCommand } from '@aws-sdk/client-sqs';

export class SQSClientProxy extends ClientProxy {
  constructor(private readonly client: SQSClient) {
    super();
  }

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

    await this.client.send(
      new SendMessageCommand({
        QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${namespace}`,
        MessageBody: JSON.stringify({
          pattern: packet.pattern, //this is important for figuring out the handler
          event: packet.data,
          eventName, //this is the event name
        }),
      })
    );
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void
  ): () => void {
    console.log('message:', packet);
    //we wont be using this in event based microservices
    return () => console.log('teardown');
  }
}
