import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { EmailModule } from '@nx-ddd/email-infrastructure';
import {
  inngest,
  InngestEventsController,
  JobEventsController,
} from '@nx-ddd/jobs-events-presentation';

import { ServerlessInngestModule } from './vercel/serverless-inngest.module';

@Module({})
export class JobEventsConsumerModule {
  static forAws(): DynamicModule {
    return {
      module: JobEventsConsumerModule,
      imports: [EmailModule],
      controllers: [JobEventsController],
      providers: [],
      exports: [],
    };
  }

  static forVercel(): DynamicModule {
    return {
      module: JobEventsConsumerModule,
      imports: [
        EmailModule,
        ServerlessInngestModule.forRoot({ inngest, path: '/api/inngest' }),
      ],
      controllers: [InngestEventsController],
      providers: [],
      exports: [],
    };
  }
}
