import { Image } from 'react-native';

export default function SkyrimIconLogo() {
  return (
    <Image
      source={require('../../../../assets/skyrim-logo.png')}
      style={{ width: 70, height: 130, marginBottom: 16 }}
    />
  );
}
