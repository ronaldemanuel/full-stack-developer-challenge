import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Mobile',
  slug: 'nx-ddd',
  scheme: 'nx-ddd',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon-light.png',
  userInterfaceStyle: 'automatic',
  updates: {
    fallbackToCacheTimeout: 0,
  },
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.anonymous.nxtestmobile',
    supportsTablet: true,
    icon: {
      light: './assets/icon-light.png',
      dark: './assets/icon-dark.png',
    },
  },
  android: {
    package: 'com.anonymous.nxtestmobile',
    adaptiveIcon: {
      foregroundImage: './assets/icon-light.png',
      backgroundColor: '#1F104A',
    },
    edgeToEdgeEnabled: true,
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#E4E4E7',
        image: './assets/icon-light.png',
        dark: {
          backgroundColor: '#18181B',
          image: './assets/icon-dark.png',
        },
      },
    ],
  ],
});
