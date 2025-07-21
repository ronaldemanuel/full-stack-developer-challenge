import { Module } from '@nestjs/common';
import { JobEventsController } from '@nx-ddd/job-events-presentation';
import { EmailModule } from '@nx-ddd/email-infrastructure';
@Module({
  imports: [EmailModule],
  controllers: [JobEventsController],
})
export class JobEventsConsumerModule {}
