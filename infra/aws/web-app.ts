import { vpc } from './vpc';

export const webApp = new sst.aws.Nextjs(`${$app.name}-web-app`, {
  buildCommand: 'exit 0;', // again, we want to get Nx to handle building
  path: 'apps/web',
  vpc,
});
