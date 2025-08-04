'use client';

import type { SessionUser } from '@/auth/use-session';
import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/auth/client';
import { useUser } from '@/auth/use-user';
import { CircleUser, LogOut, Moon, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '@nx-ddd/ui';

export function UserButton() {
  const { user } = useUser();
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  if (!user) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[8rem] p-1">
        <DropdownMenuLabel>
          <div className="flex flex-row items-center gap-2">
            <UserAvatar user={user} />
            <div>
              <p className="text-md max-w-40 truncate text-black dark:text-white">
                {user.name}
              </p>
              <p className="max-w-40 truncate text-sm text-zinc-600 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user/settings">
              <CircleUser className="size-4" />
              Account settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Moon className="size-4" />
            ) : (
              <SunMoon className="size-4" />
            )}
            Toggle theme
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess() {
                    router.replace('/');
                  },
                },
              })
            }
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface UserAvatarProps {
  user: SessionUser;
}

function UserAvatar({ user }: UserAvatarProps) {
  const fallback = useMemo<string>(() => {
    return (user?.name?.split(' ') ?? [])
      .map((name) => name.charAt(0).toUpperCase())
      .join('');
  }, [user?.name]);

  return (
    <Avatar className="size-8">
      <AvatarImage src={user.image ?? ''} alt="Avatar" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
