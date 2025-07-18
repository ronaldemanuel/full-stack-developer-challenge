export const firebaseProject = new gcp.firebase.Project('firebase-project');

export const firebaseAndroidApp = new gcp.firebase.AndroidApp('firebase-android-app', {
  displayName: $app.name,
  packageName: $app.name,
});

export const firebaseIosApp = new gcp.firebase.AppleApp('firebase-ios-app', {
  displayName: $app.name,
  bundleId: $app.name,
});

