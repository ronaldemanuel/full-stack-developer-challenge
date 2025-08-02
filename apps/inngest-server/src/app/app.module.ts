import { Module } from '@nestjs/common';
import { InngestModule } from 'nest-inngest';

import { inngest } from '@nx-ddd/jobs-events-presentation';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [InngestModule.forRoot({ inngest, path: '/api/inngest' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
