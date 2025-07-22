import { vpc } from './vpc';

// USD$ 22.00
export const database = new sst.aws.Postgres('MyDatabase', {
  vpc: vpc,
  proxy: true,
});

export const DATABASE_URL = $interpolate`postgresql://${database.username}:${database.password}@${database.host}:${database.port}/${database.database}`;

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
