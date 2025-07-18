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
          version: '1.15.0',
          team: "lisbom-29525acd"
        },
        neon: {
          version: '0.9.0',
          apiKey: process.env.NEON_API_KEY,
        },
      },
    };
  },
  async run() {
      console.log({
      VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
      VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    })
    let webAppUrl: $util.Output<string>;

    if (process.env.NEXT_APPS_PROVIDER === 'vercel') {
      const vercel = await import('./infra/vercel');
      webAppUrl = vercel.webAppDeployment.url;
    } else {
      const aws = await import('./infra/aws');
      webAppUrl = aws.webApp.url;
    }

    return {
      webAppUrl,
    };
  },
});
