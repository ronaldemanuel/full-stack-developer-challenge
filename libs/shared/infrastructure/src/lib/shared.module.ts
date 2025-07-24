import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

import { AuthModule } from '@nx-ddd/auth-infrastructure';
import {
  DatabaseModule,
  DRIZZLE_CONNECTION_NAME,
  DRIZZLE_TOKEN,
} from '@nx-ddd/database-infrastructure';
import { JobEventsProducerModule } from '@nx-ddd/job-events-infra';
import { HashService } from '@nx-ddd/shared-domain';

import { BCryptHashService } from './hash/services/bcrypt-hash.service.js';

@Global()
@Module({
  imports: [
    DatabaseModule.forDrizzle(),
    AuthModule.forBetterAuth(),
    JobEventsProducerModule.forAws(),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          connectionName: DRIZZLE_CONNECTION_NAME,
          enableTransactionProxy: true,
          adapter: new TransactionalAdapterDrizzleOrm({
            // the injection token of the Drizzle client instance
            drizzleInstanceToken: DRIZZLE_TOKEN,
          }),
        }),
      ],
    }),
  ],
  providers: [
    {
      provide: HashService.TOKEN,
      useClass: BCryptHashService, // Assuming BCryptHashService is imported from the correct path
    },
  ],
})
export class SharedModule {}
