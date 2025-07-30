import { Image, View } from 'react-native';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <View className="relative flex-1 items-center justify-center bg-black px-4">
      {/* Logo Overlay */}
      <Image
        source={require('../../../assets/skyrim-logo.png')}
        className="absolute h-96 w-96 opacity-5"
        resizeMode="contain"
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="signup-screen" />
      </Stack>
    </View>
  );
}
