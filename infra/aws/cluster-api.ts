import { vpc } from './vpc';

const cluster = new sst.aws.Cluster(`${$app.name}-api-cluster`, {
  vpc: vpc,
});

const service = new sst.aws.Service(`${$app.name}-api-service`, {
  cluster: cluster,
  loadBalancer: {
    rules: [
      {
        listen: '80/http',
        forward: '3000/http',
      },
    ],
  },
  dev: {
    command: 'npx -y nx run api:serve',
  },
  image: {
    dockerfile: 'apps/api/Dockerfile',
  },
});
