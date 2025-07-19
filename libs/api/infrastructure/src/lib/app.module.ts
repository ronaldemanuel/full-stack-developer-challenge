import { Module } from '@nestjs/common';
import { AppService } from './services/app.service.js';

@Module({
  providers: [AppService],
})
export class AppModule {}
