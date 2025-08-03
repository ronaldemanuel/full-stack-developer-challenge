import type { LoginFormData } from '@/app/(auth)';
import type { ForgotPasswordFormData } from '@/app/(auth)/forgot-password';
import type { SignupFormData } from '@/app/(auth)/signup-screen';
import { useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import { queryClient } from '@/utils/api';
import { authClient } from '@/utils/auth';

export function useAuth() {
  const toast = useToast();

  const loginWithEmail = useCallback(
    async (input: LoginFormData) => {
      try {
        await authClient.signIn.email(input);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Erro no login com Email:', err);
          toast.toast({
            title: 'Error',
            description: err.message,
            variant: 'error',
          });
        }
      }
    },
    [toast],
  );

  const signupWithEmail = useCallback(
    async (input: SignupFormData) => {
      try {
        await authClient.signUp.email(input);

        await loginWithEmail({ email: input.email, password: input.password });
      } catch (err) {
        if (err instanceof Error) {
          console.error('Erro no signup com Email:', err);
          toast.toast({
            title: 'Error',
            description: err.message,
            variant: 'error',
          });
        }
      }
    },
    [loginWithEmail, toast],
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erro no login com Google:', err);
        toast.toast({
          title: 'Error',
          description: err.message,
          variant: 'error',
        });
      }
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
      await queryClient.invalidateQueries();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erro no logout:', err);
        toast.toast({
          title: 'Error',
          description: err.message,
          variant: 'error',
        });
      }
    }
  }, [toast]);

  const forgotPassword = useCallback(
    async (input: ForgotPasswordFormData) => {
      try {
        await authClient.forgetPassword({ email: input.email });
      } catch (err) {
        if (err instanceof Error) {
          console.error('Erro no reset password:', err);
          toast.toast({
            title: 'Error',
            description: err.message,
            variant: 'error',
          });
        }
      }
    },
    [toast],
  );

  return {
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout,
    forgotPassword,
  };
}
