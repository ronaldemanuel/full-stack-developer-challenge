import { Global, Module } from '@nestjs/common';

import { AuthModule } from '@nx-ddd/auth-infrastructure';
import { DatabaseModule } from '@nx-ddd/database-infrastructure';
import { JobEventsProducerModule } from '@nx-ddd/job-events-infra';
import { HashService } from '@nx-ddd/shared-domain';

import { BCryptHashService } from './hash/services/bcrypt-hash.service.js';

@Global()
@Module({
  imports: [
    DatabaseModule.forDrizzle(),
    AuthModule.forBetterAuth(),
    JobEventsProducerModule.forAws(),
  ],
  providers: [
    {
      provide: HashService.TOKEN,
      useClass: BCryptHashService, // Assuming BCryptHashService is imported from the correct path
    },
  ],
})
export class SharedModule {}
