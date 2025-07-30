import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { Text } from '@/components/ui/text';

import SkyrimButton from '../components/atoms/skyrim-button';

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Dragonborn',
        email: 'dragonborn@skyrim.com',
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View className="relative flex-1 items-center justify-center bg-black px-4">
      {/* Gradient overlay */}
      <View className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black" />
      <View className="absolute inset-0 bg-black/50" />

      {/* Dragon logo in background */}
      <View className="absolute inset-0 items-center justify-center opacity-5">
        <Image
          source={require('../../assets/skyrim-logo.png')}
          className="h-96 w-96"
          resizeMode="contain"
        />
      </View>

      {/* Card content */}
      <View className="z-10 w-full max-w-md rounded-md border border-white/20 bg-black/90 p-8 backdrop-blur-sm">
        {/* Skyrim Logo */}
        <View className="mb-8 items-center">
          <Image
            source={require('../../assets/skyrim-logo.png')}
            className="mb-6 h-24 w-20 opacity-90"
            resizeMode="contain"
          />
          <Text className="mb-1 text-xl font-light tracking-[0.2em] text-white">
            SKYRIM
          </Text>
          <Text className="text-xs tracking-[0.3em] text-gray-400">
            THE ELDER SCROLLS V
          </Text>
        </View>

        {/* Login content */}
        <View className="space-y-6">
          <Text className="text-center text-xl font-light tracking-wider text-white">
            ENTER THE REALM
          </Text>

          <Text className="mb-5 text-center text-sm text-gray-400">
            Sign in with Google to begin your adventure
          </Text>

          <SkyrimButton
            onPress={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 text-lg"
          >
            {isLoading ? 'AUTHENTICATING...' : 'SIGN IN WITH GOOGLE'}
          </SkyrimButton>
        </View>
      </View>
    </View>
  );
}
