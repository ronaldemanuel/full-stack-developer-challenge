import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

import {
  DRIZZLE_CONNECTION_NAME,
  DRIZZLE_TOKEN,
} from '@nx-ddd/database-infrastructure';
import { EmailModule } from '@nx-ddd/email-infrastructure';
import { PostModule } from '@nx-ddd/post-infrastructure';
import { SharedModule } from '@nx-ddd/shared-infrastructure';

import { AppService } from './services/app.service.js';

@Module({
  imports: [
    SharedModule,
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
    EmailModule,
    PostModule,
  ],
  providers: [AppService],
})
export class AppModule {}
