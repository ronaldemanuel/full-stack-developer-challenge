import { vpc } from './vpc';

// USD$ 22.00
export const database = new sst.aws.Postgres('MyDatabase', {
  vpc: vpc,
  proxy: true,
});

export const DATABASE_URL = $interpolate`postgresql://${database.username}:${database.password}@${database.host}:${database.port}/${database.database}`;

const migrator = new sst.aws.Function('DatabaseMigrator', {
  handler: 'infra/aws/functions/migrator.handler',
  link: [database],
  vpc,
  copyFiles: [
    {
      from: 'libs/database/infrastructure/drizzle',
      to: './migrations',
    },
  ],
  nodejs: {
    esbuild: {
      external: [
        'amqp-connection-manager',
        'ioredis',
        'nats',
        'kafkajs',
        'mqtt',
        'class-transformer',
        'amqplib',
        'class-validator',
        '@nestjs/websockets',
        '@nestjs/platform-express',
        'ssh2',
      ],
    },
  },
  environment: {
    POSTGRES_URL: DATABASE_URL,
    NX_DAEMON: 'false',
    NX_TUI: 'false',
  },
});

if (!$dev) {
  new aws.lambda.Invocation('DatabaseMigratorInvocation', {
    input: Date.now().toString(),
    functionName: migrator.name,
  });
}

new sst.x.DevCommand('Drizzle', {
  link: [database],
  environment: {
    POSTGRES_URL: DATABASE_URL,
    NX_DAEMON: 'false',
    NX_TUI: 'false',
  },
  dev: {
    command: 'npx -y nx run database-infrastructure:studio',
  },
});
