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
      const response = await authClient.signIn.email(input);
      if (response.data === null) {
        console.error('Erro no login com Email:', input.email);
        toast.toast({
          title: 'Fail to login',
          description: response.error.message,
          variant: 'error',
        });
      }
    },
    [toast],
  );

  const signupWithEmail = useCallback(
    async (input: SignupFormData) => {
      const response = await authClient.signUp.email(input);

      if (response.data === null) {
        console.error('Erro no signup com Email:', input.email);
        toast.toast({
          title: 'Fail',
          description: response.error.message,
          variant: 'error',
        });
      }
    },
    [loginWithEmail, toast],
  );

  const loginWithGoogle = useCallback(async () => {
    const response = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });

    if (response.data === null) {
      console.error('Erro no login com Google');
      toast.toast({
        title: 'Fail',
        description: response.error.message,
        variant: 'error',
      });
    }
  }, [toast]);

  const logout = useCallback(async () => {
    const response = await authClient.signOut();
    await queryClient.invalidateQueries();

    if (response.data === null) {
      console.error('Erro no logout');
      toast.toast({
        title: 'Error',
        description: response.error.message,
        variant: 'error',
      });
    }
  }, [toast]);

  const forgotPassword = useCallback(
    async (input: ForgotPasswordFormData) => {
      const response = await authClient.forgetPassword({ email: input.email });

      if (response.data === null) {
        console.error('Erro no reset password do email: ', input.email);
        toast.toast({
          title: 'Error',
          description: response.error.message,
          variant: 'error',
        });
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
