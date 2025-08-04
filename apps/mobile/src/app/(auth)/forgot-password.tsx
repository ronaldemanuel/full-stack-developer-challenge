import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Form, FormField, FormInput } from '@/components/ui/Form';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import SkyrimButton from '@/modules/shared/components/skyrim-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      forgotPassword(data);
      router.push('/(auth)/email-sent');
    }, 1500);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
      }}
    >
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
          <SkyrimButton
            children={isLoading ? 'SENDING...' : 'SEND RESET LINK'}
            disabled={isLoading}
            onPress={form.handleSubmit(onSubmit)}
            className="mt-4 w-full py-4"
          />
        </View>
      </Form>

      <Link
        href={'/(auth)'}
        className="mt-2 text-center text-sm tracking-wider text-white"
      >
        <Text className="text-center text-white">Back to Sign In</Text>
      </Link>
    </ScrollView>
  );
}
