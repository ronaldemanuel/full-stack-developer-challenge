const subdomainMap = {
  production: 'app',
  staging: 'stg',
  development: 'dev',
};

export const domain = `${subdomainMap[$app.stage as keyof typeof subdomainMap]}.${process.env.BASE_DOMAIN}`;

export const baseUrl = `https://${domain}`;
