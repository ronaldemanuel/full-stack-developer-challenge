//main.ts
import type { MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { JobEventsConsumerModule } from '../job-events-consumer.module';
import { SqsStrategy } from './sqs.strategy';

export async function bootstrapSqs(): Promise<SqsStrategy> {
  const strategy = new SqsStrategy();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    JobEventsConsumerModule,
    {
      strategy,
    },
  );

  await app.init();
  await app.listen();

  return strategy;
}
