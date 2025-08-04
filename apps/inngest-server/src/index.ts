import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3030);

  return app.getHttpAdapter();
}
const app = await bootstrap();

module.exports = app;
