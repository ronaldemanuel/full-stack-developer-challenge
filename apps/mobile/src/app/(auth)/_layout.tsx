import { ImageBackground, View } from 'react-native';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import SkyrimIconLogo from '@/modules/shared/components/skyrim-icon-logo';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      screenLayout={({ children, route }) => {
        const titleMap = {
          'forgot-password': {
            title: 'RESET PASSWORD',
            subtitle: "Enter your email and we'll send you a reset link.",
          },
          'index': {
            title: 'ENTER THE REALM',
          },
          'signup-screen': {
            title: 'ENTER THE REALM',
          },
          'email-sent': {
            title: 'EMAIL SENT',
            subtitle:
              "We've sent a password reset link to your email address. Please check your inbox and follow the instructions.",
          },
        };

        const currentTitle = titleMap[route.name as keyof typeof titleMap];

        return (
          <View className="relative flex-1 items-center justify-center">
            <ImageBackground
              source={require('../../../assets/skyrim-logo.png')}
              className="absolute h-1/2 w-1/2"
              resizeMode="contain"
            />
            <Card className="w-full max-w-md border border-white/20 bg-black/90 p-6">
              <View className="mb-6 items-center">
                <SkyrimIconLogo />
                <Text className="text-xl font-light tracking-widest text-white">
                  SKYRIM
                </Text>
                <Text className="text-xs tracking-widest text-gray-400">
                  THE ELDER SCROLLS V
                </Text>
              </View>

              <Text className="mb-4 text-center text-lg tracking-wider text-white">
                {currentTitle.title}
              </Text>
              {'subtitle' in currentTitle && (
                <Text className="mt-2 text-center text-sm text-gray-400">
                  {currentTitle.subtitle}
                </Text>
              )}
              {children}
            </Card>
          </View>
        );
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="signup-screen" />
      <Stack.Screen name="email-sent" />
    </Stack>
  );
}
