import { vpc } from './vpc';

// $USD 12.00 per month
export const redis = new sst.aws.Redis('redis', {
  vpc,
  dev: {
    host: 'localhost',
    port: 6379,
  },
});

// use $interpolate to get the URL in the environment with tls username and password
export const REDIS_URL = $interpolate`redis://${redis.username}:${redis.password}@${redis.host}:${redis.port}`;
