export const appQueue = new sst.aws.Queue('app-queue');

appQueue.subscribe('apps/events-processor/src/index.lambdaHandler');
