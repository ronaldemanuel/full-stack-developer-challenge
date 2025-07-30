import type { LoginFormData } from '@/app/(auth)';
import type { SignupFormData } from '@/app/(auth)/signup-screen';
import { queryClient } from '@/utils/api';
import { authClient } from '@/utils/auth';

export const handleEmailLogin = async (input: LoginFormData) => {
  try {
    await authClient.signIn.email(input);
  } catch (err) {
    console.error('Erro no login com Email:', err);
  }
};

export const handleEmailSignup = async (input: SignupFormData) => {
  await authClient.signUp.email(input);
};

export const handleGoogleLogin = async () => {
  try {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  } catch (err) {
    console.error('Erro no login com Google:', err);
  }
};

export const handleLogout = async () => {
  await authClient.signOut();
  await queryClient.invalidateQueries();
};
