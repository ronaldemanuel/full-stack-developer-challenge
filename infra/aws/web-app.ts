import { redis, REDIS_URL } from './cache';
import { database, DATABASE_URL } from './database';
import { baseUrl } from './domain';
import { appQueue } from './queue';
import { bucket } from './storage';
import { vpc } from './vpc';

export function webApp(credentials: {
  clientId: $util.Output<string>;
  clientSecret: $util.Output<string>;
}) {
  const webApp = new sst.aws.Nextjs(`${$app.name}-web-app`, {
    buildCommand: 'exit 0;', // again, we want to get Nx to handle building
    dev: {
      command: 'npx -y nx run web:dev',
    },
    // domain: {
    //   name: domain,
    //   dns: false,
    //   cert: process.env['DOMAIN_CERTIFICATE_ARN'] || '',
    // },
    path: 'apps/web',
    link: [bucket, appQueue, database, redis],
    environment: {
      EMAIL_FROM: process.env.EMAIL_FROM || '',
      EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || '',
      EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || '',
      EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT || '',
      EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || '',
      EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS || '',
      AUTH_SECRET: process.env.AUTH_SECRET || '',
      POSTGRES_URL: DATABASE_URL,
      BASE_URL:
        !process.env.BASE_URL ||
        process.env.BASE_URL === 'http://localhost:3000'
          ? baseUrl
          : process.env.BASE_URL,
      NEXT_APPS_PROVIDER: 'aws',
      AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || credentials.clientId,
      AUTH_GOOGLE_SECRET:
        process.env.AUTH_GOOGLE_SECRET || credentials.clientSecret,
      APP_QUEUE_URL: appQueue.url,
      NX_TUI: 'false',
      REDIS_URL: REDIS_URL,
    },
    vpc,
  });
  return webApp;
}
