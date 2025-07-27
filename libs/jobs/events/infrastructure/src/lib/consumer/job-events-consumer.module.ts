import { Module } from '@nestjs/common';

import { EmailModule } from '@nx-ddd/email-infrastructure';
import { JobEventsController } from '@nx-ddd/jobs-events-presentation';

@Module({
  imports: [EmailModule],
  controllers: [JobEventsController],
})
export class JobEventsConsumerModule {}
