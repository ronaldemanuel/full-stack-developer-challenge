import { email } from './email';

export const appQueue = new sst.aws.Queue('app-queue');

const links = [email].filter(Boolean);

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
    DB_USER: process.env.DB_USER || '',
    DB_PASS: process.env.DB_PASS || '',
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: process.env.DB_PORT || '',
    DB_PROXY_PORT: process.env.DB_PROXY_PORT || '',
    DB_NAME: process.env.DB_NAME || '',
    POSTGRES_URL: process.env.POSTGRES_URL || '',
    BASE_URL: process.env.BASE_URL || '',
    NEXT_APPS_PROVIDER: process.env.NEXT_APPS_PROVIDER || '',
    VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN || '',
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID || '',
    NEON_API_KEY: process.env.NEON_API_KEY || '',
    NEON_ORG_ID: process.env.NEON_ORG_ID || '',
    EXPO_TOKEN: process.env.EXPO_TOKEN || '',
    EXPO_ACCOUNT_NAME: process.env.EXPO_ACCOUNT_NAME || '',
  },
});
