// LoginScreen.tsx (React Native version using tailwindcss-react-native, shadcn/ui, zod, RHF)

import React, { useState } from 'react';
import { Image, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { handleEmailLogin } from '@/modules/auth/hooks/use-auth';
import SkyrimIconLogo from '@/modules/shared/components/skyrim-icon-logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      handleEmailLogin(data);
      setIsLoading(false);
      router.replace('/(tabs)/inventory');
    }, 1500);
  };

  return (
    <View className="relative flex-1 items-center justify-center bg-black px-4">
      {/* Logo Overlay */}
      <Image
        source={require('../../../assets/skyrim-logo.png')}
        className="absolute h-96 w-96 opacity-5"
        resizeMode="contain"
      />
      <Card className="w-full max-w-md border border-white/20 bg-black/80 p-6">
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
          ENTER THE REALM
        </Text>

        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="mb-1 text-sm tracking-wider text-gray-300">
                EMAIL
              </Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
              />
              {errors.email && (
                <Text className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="mb-1 text-sm tracking-wider text-gray-300">
                PASSWORD
              </Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
              />
              {errors.password && (
                <Text className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Forgot Password Link */}
        <Link href={'/forgot-password'} className="mb-6 self-end">
          <Text className="text-sm tracking-wider text-gray-400 hover:text-white">
            Forgot Password?
          </Text>
        </Link>

        {/* Login Button */}
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="mb-4 py-3"
        >
          <Text>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}</Text>
        </Button>

        {/* Signup Link */}
        <View className="items-center border-t border-white/20 pt-4">
          <Text className="mb-2 text-sm text-gray-400">
            Don't have an account?
          </Text>
          <Link href={'/signup-screen'}>
            <Text className="text-sm tracking-wider text-white">
              Create Account
            </Text>
          </Link>
        </View>
      </Card>
    </View>
  );
}
