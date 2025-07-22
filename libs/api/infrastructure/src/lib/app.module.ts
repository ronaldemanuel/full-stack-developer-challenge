import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

import { AuthModule } from '@nx-ddd/auth-infrastructure';
import {
  DatabaseModule,
  DRIZZLE_CONNECTION_NAME,
  DRIZZLE_TOKEN,
} from '@nx-ddd/database-infrastructure';
import { EmailModule } from '@nx-ddd/email-infrastructure';

import { AppService } from './services/app.service.js';

@Module({
  imports: [
    AuthModule.forBetterAuth(),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          connectionName: DRIZZLE_CONNECTION_NAME,
          enableTransactionProxy: true,
          imports: [
            // module in which Drizzle is provided
            DatabaseModule.forDrizzle(),
          ],
          adapter: new TransactionalAdapterDrizzleOrm({
            // the injection token of the Drizzle client instance
            drizzleInstanceToken: DRIZZLE_TOKEN,
          }),
        }),
      ],
    }),
    EmailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
