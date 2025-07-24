'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/auth/client';
import { GearIcon } from '@radix-ui/react-icons';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

import type { ActiveOrganization, Organization } from '@nx-ddd/auth-domain';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@nx-ddd/ui';

interface OrganizationSwitcherProps {
  selectedOrganization: ActiveOrganization;
}

export function OrganizationSwitcher({
  selectedOrganization,
}: OrganizationSwitcherProps) {
  return (
    <Suspense fallback={<OrganizationSwitcherFallback />}>
      <OrganizationSwitcherSuspended
        selectedOrganization={selectedOrganization}
      />
    </Suspense>
  );
}

function OrganizationSwitcherSuspended({
  selectedOrganization,
}: OrganizationSwitcherProps) {
  const router = useRouter();

  const {
    data: { data: organizations },
  } = useSuspenseQuery({
    queryKey: ['organization.list'],
    queryFn: () => authClient.organization.list(),
  });

  const { mutate: setActiveOrganization, isPending } = useMutation({
    mutationKey: ['organization.setActive'],
    mutationFn: async (organizationId: string) => {
      await authClient.organization.setActive({ organizationId });
    },
    onSuccess: () => {
      router.replace('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-full items-center justify-between"
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            <OrganizationAvatar organization={selectedOrganization} />
            {selectedOrganization.name}
          </div>

          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup
              heading={
                <div className="flex items-center justify-between">
                  <p className="text-sm">Current</p>
                  <Button variant="ghost" size="icon">
                    <Link href={`/team/${selectedOrganization.slug}/settings`}>
                      <GearIcon className="size-4" />
                    </Link>
                  </Button>
                </div>
              }
            >
              <CommandItem
                key={selectedOrganization.id}
                value={selectedOrganization.id}
                className="justify-between"
                disabled
              >
                <div className="flex items-center gap-2">
                  <OrganizationAvatar organization={selectedOrganization} />
                  {selectedOrganization.name}
                </div>

                <Check />
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading={<p className="text-sm">Others</p>}>
              {organizations
                ?.filter(
                  (organization) => organization.id !== selectedOrganization.id,
                )
                .map((organization) => (
                  <CommandItem
                    key={organization.id}
                    value={organization.id}
                    onSelect={setActiveOrganization}
                    disabled={isPending}
                  >
                    <OrganizationAvatar organization={organization} />
                    {organization.name}
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem className="h-10" disabled={isPending} asChild>
                <Link href="/organizations/new">
                  <PlusCircle className="" />
                  Create a team
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface OrganizationAvatarProps {
  organization: Organization;
}

function OrganizationAvatar({ organization }: OrganizationAvatarProps) {
  return (
    <Avatar className="size-6 !rounded">
      <AvatarImage
        className="!rounded object-cover"
        src={organization.logo ?? undefined}
      />
      <AvatarFallback className="rounded bg-zinc-200 text-black">
        {organization.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}

function OrganizationSwitcherFallback() {
  return <Skeleton className="h-9 w-full" />;
}
