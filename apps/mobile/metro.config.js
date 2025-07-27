const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = withNativeWind(getDefaultConfig(__dirname), {
  input: './src/styles.css',
  configPath: './tailwind.config.js',
});
// const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: 'mobile',
  // transformer: {
  //   babelTransformerPath: require.resolve('react-native-svg-transformer'),
  // },
  // resolver: {
  //   assetExts: assetExts.filter((ext) => ext !== 'svg'),
  //   sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
  // },
};

module.exports = mergeConfig(defaultConfig, customConfig);
