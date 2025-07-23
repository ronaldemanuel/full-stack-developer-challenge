//main.ts
import type { MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { JobEventsConsumerModule } from '../job-events-consumer.module.js';
import { SqsStrategy } from './sqs.strategy.js';

export * from './sqs.strategy.js';

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
