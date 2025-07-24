/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'nx-ddd',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        '@pulumiverse/vercel': {
          version: '1.15.0',
          team: 'lisbom-29525acd',
        },
        'neon': '0.9.0',
        '@lisbom/eas': '1.17.1',
        'gcp': {
          version: '8.38.0',
          userProjectOverride: true,
        },
      },
    };
  },
  async run() {
    let webAppUrl: $util.Output<string>;
    let queueUrl: $util.Output<string> | undefined;
    let cdnUrl: $util.Output<string> | undefined;
    const google = await import('./infra/gcp');

    const googleAuthCredentials = google.createOauthClient();
    if (process.env.NEXT_APPS_PROVIDER === 'vercel') {
      const vercel = await import('./infra/vercel');
      webAppUrl = vercel.webAppDeployment.url;
    } else {
      const aws = await import('./infra/aws');
      const webApp = aws.webApp(googleAuthCredentials);
      webAppUrl = webApp.url;
      queueUrl = aws.appQueue.url;
      cdnUrl = webApp.nodes.cdn?.url;
    }

    const expo = await import('./infra/expo');

    return {
      webAppUrl,
      expoAppId: expo.app.id,
      googleAuthCredentials,
      queueUrl,
      cdnUrl,
    };
  },
});
