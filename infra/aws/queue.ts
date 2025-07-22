import { DATABASE_URL } from './database';
import { email } from './email';

export const appQueue = new sst.aws.Queue('app-queue');

const links = [email].filter(Boolean);

// 0800 de gratis
appQueue.subscribe({
  handler: 'apps/events-processor/src/index.lambdaHandler',
  runtime: 'nodejs22.x',
  nodejs: {
    esbuild: {
      external: [
        'class-validator',
        'class-transformer',
        '@nestjs/websockets',
        'kafkajs',
        'mqtt',
        'nats',
        'amqplib',
        'amqp-connection-manager',
      ],
    },
  },
  link: links,
  environment: {
    EMAIL_FROM: process.env.EMAIL_FROM || '',
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || '',
    EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || '',
    EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT || '',
    EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || '',
    EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS || '',
    AUTH_SECRET: process.env.AUTH_SECRET || '',
    POSTGRES_URL: DATABASE_URL,
    BASE_URL: process.env.BASE_URL || '',
    NEXT_APPS_PROVIDER: 'aws',
  },
});
