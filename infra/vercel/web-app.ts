export const webAppProject = new vercel.Project('web-app', {
  name: `${$app.name}-web-app`,
  framework: 'nextjs',
  rootDirectory: 'apps/web',
  buildCommand: 'pnpm nx run web:build',
  teamId: process.env.VERCEL_TEAM_ID,
  gitRepository: {
    repo: 'lisbom-dev/nx-ddd-template',
    type: 'github',
  },
});

export const webAppDeployment = new vercel.Deployment('web-app-deployment', {
  projectId: webAppProject.id,
  ref: 'main',
  production: true,
  teamId: process.env.VERCEL_TEAM_ID,
});
