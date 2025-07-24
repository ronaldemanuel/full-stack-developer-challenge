import { redirect } from 'next/navigation';
import { ServerAuthService } from '@/auth/server';
import { parseServerData } from '@/helpers/parse-server-data';
import { tryCatch } from '@/lib/try-catch';

import { AccountSwitcher } from './_components/account-switcher';
import { OrganizationCard } from './_components/organization-card';
import { UserCard } from './_components/user-card';

export default async function DashboardPage() {
  const [data, error] = await tryCatch(
    Promise.all([
      ServerAuthService.getSession(),
      ServerAuthService.getSessionsList(),
      ServerAuthService.getDeviceSessionsList(),
      ServerAuthService.getFullOrganization(),
    ]),
  );

  if (error) {
    redirect('/sign-in');
  }

  const [session, activeSessions, deviceSessions, organization] = data;

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col gap-4 py-2">
        <AccountSwitcher sessions={parseServerData(deviceSessions)} />
        <UserCard
          session={parseServerData(session)}
          activeSessions={parseServerData(activeSessions)}
        />
        <OrganizationCard
          session={parseServerData(session)}
          activeOrganization={parseServerData(organization)}
        />
      </div>
    </div>
  );
}
