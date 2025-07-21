import { Module } from '@nestjs/common';
import { AppService } from './services/app.service.js';
import { AuthModule } from '@nx-ddd/auth-infrastructure';

@Module({
  imports: [AuthModule.forBetterAuth()],
  providers: [AppService],
})
export class AppModule {}
