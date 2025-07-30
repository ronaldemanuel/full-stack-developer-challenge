import React, { useState } from 'react';
import { Image, ScrollView, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '@/components/ui/text';
import { handleEmailSignup } from '@/modules/auth/hooks/use-auth';
import { FormMessage } from '@/modules/shared/components/form-message';
import SkyrimButton from '@/modules/shared/components/skyrim-button';
import SkyrimIconLogo from '@/modules/shared/components/skyrim-icon-logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      handleEmailSignup(data);
      setIsLoading(false);
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
      <ScrollView
        className="w-full"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View className="rounded-2xl border border-white/20 bg-black/80 p-6">
          <View className="mb-6 items-center">
            <SkyrimIconLogo />
            <Text className="mt-2 text-2xl font-light tracking-widest text-white">
              SKYRIM
            </Text>
            <Text className="text-xs tracking-[0.3em] text-gray-400">
              THE ELDER SCROLLS V
            </Text>
          </View>

          {/* Name Field */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-4">
                <Text className="mb-1 text-sm text-white">NAME</Text>
                <TextInput
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
                />
                <FormMessage error={errors.name?.message} />
              </View>
            )}
          />

          {/* Email Field */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-4">
                <Text className="mb-1 text-sm text-white">EMAIL</Text>
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
                />
                <FormMessage error={errors.email?.message} />
              </View>
            )}
          />

          {/* Password Field */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-4">
                <Text className="mb-1 text-sm text-white">PASSWORD</Text>
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
                />
                <FormMessage error={errors.password?.message} />
              </View>
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-4">
                <Text className="mb-1 text-sm text-white">
                  CONFIRM PASSWORD
                </Text>
                <TextInput
                  placeholder="Confirm your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
                />
                <FormMessage error={errors.confirmPassword?.message} />
              </View>
            )}
          />

          {/* Submit Button */}
          <SkyrimButton
            children={isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
            className="mt-4 py-4 text-lg"
          />

          {/* Navigation */}
          <View className="mt-6 items-center border-t border-white/20 pt-4">
            <Text className="mb-2 text-sm text-gray-400">
              Already have an account?
            </Text>
            <Link href={'/(auth)'}>
              <Text className="text-sm tracking-wider text-white">Sign In</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
