import React, { useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/Form';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
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

  const { signupWithEmail } = useAuth();

  const form = useForm<SignupFormData>({
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
      signupWithEmail(data);
      setIsLoading(false);
      router.replace('/confirmation-email-sent');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      className="w-full"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      behavior={'position'}
    >
      <Form {...form}>
        <View className="gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="NAME"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Enter your name"
                placeholderTextColor="#aaa"
                className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
              />
            )}
          />
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
                secureTextEntry
                className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
              />
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="CONFIRM PASSWORD"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Confirm your password"
                placeholderTextColor="#aaa"
                secureTextEntry
                className="rounded-md border border-white/30 bg-black/60 px-4 py-3 text-white"
              />
            )}
          />
          <Button
            disabled={isLoading}
            onPress={form.handleSubmit(onSubmit)}
            className="mt-4 py-4 text-lg"
          >
            {isLoading ? (
              <Text>CREATING ACCOUNT...</Text>
            ) : (
              <Text>CREATE ACCOUNT</Text>
            )}
          </Button>
        </View>
      </Form>

      {/* Navigation */}
      <View className="mt-6 items-center border-t border-white/20 pt-4">
        <Text className="mb-2 text-sm text-gray-400">
          Already have an account?
        </Text>
        <Link href={'/(auth)'}>
          <Text className="text-sm tracking-wider text-white">Sign In</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
