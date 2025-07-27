const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = withNativeWind(getDefaultConfig(__dirname), {
  input: './src/styles.css',
  configPath: './tailwind.config.js',
});

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: 'mobile',
};

const config = mergeConfig(defaultConfig, customConfig);

// XXX: Resolve our exports in workspace packages
// https://github.com/expo/expo/issues/26926
config.resolver.unstable_enablePackageExports = true;

// https://github.com/expo/expo/issues/26926
config.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'react-native',
];

module.exports = withNxMetro(config);
