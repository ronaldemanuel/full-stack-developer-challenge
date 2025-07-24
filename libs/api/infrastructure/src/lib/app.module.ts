import { Module } from '@nestjs/common';

import { EmailModule } from '@nx-ddd/email-infrastructure';
import { PostModule } from '@nx-ddd/post-infrastructure';
import { SharedModule } from '@nx-ddd/shared-infrastructure';

import { AppService } from './services/app.service.js';

@Module({
  imports: [SharedModule, EmailModule, PostModule],
  providers: [AppService],
})
export class AppModule {}
