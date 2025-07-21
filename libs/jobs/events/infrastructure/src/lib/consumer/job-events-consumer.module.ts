import { Module } from '@nestjs/common';
import { JobEventsController } from '@nx-ddd/job-events-presentation';

@Module({
  controllers: [JobEventsController],
})
export class JobEventsConsumerModule {}
