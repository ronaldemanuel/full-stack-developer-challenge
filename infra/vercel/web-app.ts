export const webAppProject = new vercel.Project('web-app', {
  name: `${$app.name}-web-app`,
  framework: 'nextjs',
  rootDirectory: 'apps/web-app',
  buildCommand: 'pnpm nx run web:build',
});

export const webAppDeployment = new vercel.Deployment('web-app-deployment', {
  projectId: webAppProject.id,
  ref: 'main',
  production: true,
});
