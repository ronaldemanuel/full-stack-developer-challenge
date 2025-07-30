import React, { useState } from 'react';
import { Image, ScrollView, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import SkyrimButton from '@/modules/shared/components/skyrim-button';
import SkyrimIconLogo from '@/modules/shared/components/skyrim-icon-logo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View className="relative flex flex-1 items-center justify-center bg-black px-4">
      {/* Logo Overlay */}
      <Image
        source={require('../../../assets/skyrim-logo.png')}
        className="absolute h-96 w-96 opacity-5"
        resizeMode="contain"
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: 'black',
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
      >
        {isSubmitted ? (
          <Card className="rounded-xl border border-white/20 bg-black p-6">
            <View className="items-center">
              <SkyrimIconLogo />
              <Text className="text-xl tracking-widest text-white">
                EMAIL SENT
              </Text>
              <Text className="mt-4 text-center text-sm text-gray-400">
                We've sent a password reset link to your email address. Please
                check your inbox and follow the instructions.
              </Text>
              <View className="mt-6 w-full">
                <Link href={'/(auth)'} className="w-full py-4">
                  <Text className="text-center text-white">
                    BACK TO SIGN IN
                  </Text>
                </Link>
              </View>
            </View>
          </Card>
        ) : (
          <Card className="rounded-xl border border-white/20 bg-black p-6">
            <View className="mb-6 items-center">
              <SkyrimIconLogo />
              <Text className="text-xl tracking-widest text-white">
                RESET PASSWORD
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-400">
                Enter your email and we'll send you a reset link.
              </Text>
            </View>

            <FormProvider {...form}>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <View className="mb-4">
                    <Text className="mb-1 text-sm text-gray-300">EMAIL</Text>
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor="#aaa"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
                    />
                    {fieldState.error && (
                      <Text className="mt-1 text-xs text-red-400">
                        {fieldState.error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <SkyrimButton
                children={isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                disabled={isLoading}
                onPress={form.handleSubmit(onSubmit)}
                className="mt-4 w-full py-4"
              />

              <Link
                href={'/(auth)'}
                className="mt-2 text-center text-sm tracking-wider text-white"
              >
                <Text className="text-center text-white">Back to Sign In</Text>
              </Link>
            </FormProvider>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
