import Link from 'next/link';
import { ServerAuthService } from '@/auth/server';

import { buttonVariants } from '@nx-ddd/ui';

function SignInSignUpButtons() {
  const app = {
    urls: {
      signIn: '/sign-in',
    },
  };
  return (
    <>
      <Link
        href={app.urls.signIn}
        className={buttonVariants({ variant: 'secondary' })}
      >
        Sign In
      </Link>
    </>
  );
}

export async function AuthButtons() {
  const session = await ServerAuthService.getSession();

  if (session) {
    return (
      <Link
        href="/dashboard"
        className={buttonVariants({ variant: 'default' })}
      >
        Dashboard
      </Link>
    );
  } else {
    return <SignInSignUpButtons />;
  }
}
