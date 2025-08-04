import { Module } from '@nestjs/common';
import { InngestModule } from 'nest-inngest';

import { EmailModule } from '@nx-ddd/email-infrastructure';
import {
  inngest,
  InngestEventsController,
} from '@nx-ddd/jobs-events-presentation';

import { AppService } from './app.service';

@Module({
  imports: [
    EmailModule,
    InngestModule.forRoot({ inngest, path: '/api/inngest' }),
  ],
  controllers: [InngestEventsController],
  providers: [AppService],
})
export class AppModule {}
