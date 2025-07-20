import { appQueue } from './queue';
import { bucket } from './storage';
import { vpc } from './vpc';

export const webApp = new sst.aws.Nextjs(`${$app.name}-web-app`, {
  buildCommand: 'exit 0;', // again, we want to get Nx to handle building
  path: 'apps/web',
  vpc,
  link: [bucket, appQueue],
});
