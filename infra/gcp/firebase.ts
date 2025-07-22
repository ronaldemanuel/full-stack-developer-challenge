// Substitua pelo ID real do seu projeto
const project = gcp.config.project;
console.log(`Project ID: ${project}`);

// Habilitar APIs necessárias para o Firebase

const cloudResourcemanager = new gcp.projects.Service(
  'cloudresourcemanager-api',
  {
    project,
    service: 'cloudresourcemanager.googleapis.com',
  },
);

const iamApi = new gcp.projects.Service('iam-api', {
  project,
  service: 'iam.googleapis.com',
});

const serviceusageApi = new gcp.projects.Service('serviceusage-api', {
  project,
  service: 'serviceusage.googleapis.com',
});

const firebaseApi = new gcp.projects.Service(
  'firebase-api',
  {
    project,
    service: 'firebase.googleapis.com',
  },
  {
    dependsOn: [cloudResourcemanager, iamApi, serviceusageApi],
  },
);

const _default = new gcp.organizations.Project(
  'default',
  {
    projectId: `${$app.name}-firebase-project`,
    name: `${$app.name}-firebase-project`,
    deletionPolicy: 'DELETE',
    labels: {
      firebase: 'enabled',
    },
  },
  {
    dependsOn: [firebaseApi],
  },
);

const firebaseProject = new gcp.firebase.Project('default', {
  project: _default.projectId,
});

export const firebaseAndroidApp = new gcp.firebase.AndroidApp(
  'firebase-android-app',
  {
    displayName: $app.name,
    packageName: $app.name,
    project: firebaseProject.id,
  },
);

export const firebaseIosApp = new gcp.firebase.AppleApp('firebase-ios-app', {
  displayName: $app.name,
  bundleId: $app.name,
  project: firebaseProject.id,
});

// Cria a service account
const serviceAccount = new gcp.serviceaccount.Account(
  'firebaseServiceAccount',
  {
    accountId: 'firebase-service-account',
    displayName: 'Firebase Service Account',
    project: firebaseProject.project,
  },
);

// Concede permissões específicas (exemplo: Firebase Admin)
new gcp.projects.IAMMember('firebaseAdminRole', {
  project: firebaseProject.project,
  role: 'roles/firebase.admin', // você pode trocar esse papel se quiser limitar
  member: $interpolate`serviceAccount:${serviceAccount.email}`,
});

// Cria uma key para a service account (gera JSON)
const serviceAccountKey = new gcp.serviceaccount.Key(
  'firebaseServiceAccountKey',
  {
    serviceAccountId: serviceAccount.name,
  },
);

// Exporta a chave codificada em base64 (JSON)
export const serviceAccountPrivateKey = serviceAccountKey.privateKey.apply(
  (key) => Buffer.from(key, 'base64').toString('utf8'),
);
