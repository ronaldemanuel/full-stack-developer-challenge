'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useUser } from '@/auth/use-user';
import { Logo } from '@/components/shared/logo';
import { Menu, X } from 'lucide-react';

import { Button, buttonVariants } from '@nx-ddd/ui';
import { cn } from '@nx-ddd/ui-utils';

import { ColorModeSwitcher } from './color-mode-switcher';

interface NavProps {
  items?: {
    title: string;
    href: string;
    disabled?: boolean;
    external?: boolean;
  }[];
}

function SignInSignUpButtons() {
  const app = {
    urls: {
      signIn: '/sign-in',
      signUp: '/sign-up',
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

      <Link
        href={app.urls.signUp}
        className={buttonVariants({ variant: 'default' })}
      >
        Sign Up
      </Link>
    </>
  );
}

function AuthButtonsInner() {
  const { user } = useUser();

  if (user) {
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

function AuthButtons() {
  return (
    <React.Suspense fallback={<SignInSignUpButtons />}>
      <AuthButtonsInner />
    </React.Suspense>
  );
}

function MobileItems(props: NavProps) {
  return (
    <div className="animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 md:hidden">
      <div className="bg-popover text-popover-foreground relative z-20 grid gap-6 rounded-md p-4 shadow-md">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {props.items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                item.disabled && 'cursor-not-allowed opacity-60',
              )}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
            >
              {item.title}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-2">
            <AuthButtons />
          </div>
        </nav>
      </div>
    </div>
  );
}

function DesktopItems(props: NavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <nav className="hidden gap-6 md:flex">
      {props.items?.map((item, index) => (
        <Link
          key={index}
          href={item.disabled ? '#' : item.href}
          className={cn(
            'hover:text-foreground/80 flex items-center text-lg font-medium transition-colors sm:text-sm',
            item.href.startsWith(`/${segment}`)
              ? 'text-foreground'
              : 'text-foreground/60',
            item.disabled && 'cursor-not-allowed opacity-80',
          )}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export function LandingPageHeader(props: NavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <header className="bg-background/80 fixed z-50 w-full px-4 backdrop-blur md:px-8">
      <div className="h-18 flex items-center justify-between py-4">
        <div className="flex items-center gap-4 md:gap-10">
          <Logo className="hidden md:flex" />

          {props.items?.length ? <DesktopItems items={props.items} /> : null}

          <Button
            className="space-x-2 md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          <Logo className="md:hidden" />

          {showMobileMenu && props.items && <MobileItems items={props.items} />}
        </div>

        <div className="flex items-center gap-4">
          <ColorModeSwitcher />
          <nav className="hidden items-center gap-4 md:flex">
            <AuthButtons />
          </nav>
        </div>
      </div>
    </header>
  );
}
