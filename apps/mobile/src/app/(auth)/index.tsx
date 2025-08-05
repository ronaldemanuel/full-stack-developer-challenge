// LoginScreen.tsx (React Native version using tailwindcss-react-native, shadcn/ui, zod, RHF)

import React, { useState } from 'react';
import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/Form';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useUser } from '@/modules/auth/hooks/use-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithEmail } = useAuth();
  const { refetch } = useUser();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    await loginWithEmail(data);
    await refetch();
    router.replace('/(tabs)/inventory');
    setIsLoading(false);
  };

  return (
    <View>
      <Form {...form}>
        <View className="gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="EMAIL"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
              />
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="PASSWORD"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
                secureTextEntry
              />
            )}
          />
        </View>

        {/* Forgot Password Link */}
        <Link href={'/forgot-password'} className="z-10 mb-6 self-end" asChild>
          <Button variant="link">
            <Text className="text-sm text-gray-400 hover:text-white">
              Forgot Password?
            </Text>
          </Button>
        </Link>

        {/* Login Button */}
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          className="mb-4 py-3"
        >
          <Text>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}</Text>
        </Button>
      </Form>

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
    </View>
  );
}
