'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/auth/client';
import { Label } from '@nx-ddd/ui';
import { toast } from 'sonner';

import { Button, Input } from '@nx-ddd/ui';

export function PageClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [teamDisplayName, setTeamDisplayName] = useState('');
  const [teamSlug, setTeamSlug] = useState('');

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-xs">
        <h1 className="text-center text-2xl font-semibold">Welcome!</h1>
        <p className="text-center text-gray-500">
          Create a team to get started
        </p>
        <form
          className="mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            await authClient.organization
              .create({
                name: teamDisplayName,
                slug: teamSlug,
                keepCurrentActiveOrganization: false,
              })
              .then(() => {
                router.push(`/dashboard/${teamSlug}`);
              })
              .catch(() => {
                toast.error('Something went wrong');
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          <div>
            <Label className="text-sm">Team name</Label>
            <Input
              placeholder="Team name"
              value={teamDisplayName}
              onChange={(e) => setTeamDisplayName(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <Label className="text-sm">Team slug</Label>
            <Input
              placeholder="Team slug"
              value={teamSlug}
              onChange={(e) => setTeamSlug(e.target.value)}
            />
          </div>

          <Button className="mt-4 w-full" disabled={isLoading}>
            Create team
          </Button>
        </form>
      </div>
    </div>
  );
}
