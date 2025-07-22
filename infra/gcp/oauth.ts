export function createOauthClient(redirectUris: string[] = []) {
  const oauthClient = new gcp.iam.OauthClient('oauth_client', {
    oauthClientId: `${$app.name}-app-login-client`,
    location: 'global',
    allowedGrantTypes: ['AUTHORIZATION_CODE_GRANT'],
    allowedRedirectUris: [
      'http://localhost:3000/api/auth/callback/google',
      ...redirectUris,
    ],
    allowedScopes: ['https://www.googleapis.com/auth/cloud-platform'],
    clientType: 'CONFIDENTIAL_CLIENT',
    project: gcp.config.project,
  });

  const oauthCredential = new gcp.iam.OauthClientCredential(
    'oauth_credential',
    {
      oauthclient: oauthClient.oauthClientId,
      location: oauthClient.location,
      oauthClientCredentialId: `${$app.name}-app-oauth-login-cred`,
      disabled: true,
      displayName: 'OAuth Login Credential',
      project: gcp.config.project,
    },
  );

  return {
    clientId: oauthClient.oauthClientId,
    clientSecret: oauthCredential.clientSecret,
  };
}
