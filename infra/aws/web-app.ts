import { appQueue } from './queue';
import { bucket } from './storage';

export const webApp = new sst.aws.Nextjs(`${$app.name}-web-app`, {
  buildCommand: 'exit 0;', // again, we want to get Nx to handle building
  path: 'apps/web',
  link: [bucket, appQueue],
});
