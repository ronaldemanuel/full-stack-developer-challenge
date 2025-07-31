import { Module } from '@nestjs/common';

import { EmailModule } from '@nx-ddd/email-infrastructure';
import { ItemModule } from '@nx-ddd/item-infrastructure';
import { PostModule } from '@nx-ddd/post-infrastructure';
import { SharedModule } from '@nx-ddd/shared-infrastructure';
import { UserModule } from '@nx-ddd/user-infrastructure';

import { AppService } from './services/app.service';

@Module({
  imports: [
    SharedModule.forRoot(),
    EmailModule,
    UserModule,
    PostModule,
    ItemModule,
  ],
  providers: [AppService],
})
export class AppModule {}
