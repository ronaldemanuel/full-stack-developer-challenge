import { email } from './email';

export const appQueue = new sst.aws.Queue('app-queue');

const links = [email].filter(Boolean);

appQueue.subscribe({
  handler: 'apps/events-processor/src/index.lambdaHandler',
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
});
