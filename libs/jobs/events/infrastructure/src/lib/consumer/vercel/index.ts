import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ReplaySubject } from 'rxjs';

import { JobEventsConsumerModule } from '../job-events-consumer.module';

export { inngest } from '@nx-ddd/jobs-events-presentation';
export * from './serverless-inngest.service';

export const inngestSubject = new ReplaySubject<INestApplicationContext>();

function bootstrap() {
  NestFactory.createApplicationContext(JobEventsConsumerModule.forVercel())
    .then((app) => {
      inngestSubject.next(app);
    })
    .catch((error) => {
      console.error('Error bootstrapping Inngest:', error);
      process.exit(1);
    });
}
bootstrap();
