/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'nx-ddd-template',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        '@pulumiverse/vercel': {
          version: '3.2.1',
          apiToken: process.env.VERCEL_API_TOKEN,
          teamId: process.env.VERCEL_TEAM_ID,
        },
        neon: {
          version: '0.9.0',
          apiKey: process.env.NEON_API_KEY,
        },
      },
    };
  },
  async run() {
    // const vercel = await import('./infra/vercel');
    // return {
    //   webAppUrl: vercel.webAppDeployment.url,
    // };
    const aws = await import('./infra/aws');
    return {
      webAppUrl: aws.webApp.url,
    };
  },
});
