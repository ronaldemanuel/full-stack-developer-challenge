import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ServerAuthService } from '@/auth/server';

import { PageClient } from './page-client';

export const metadata: Metadata = {
  title: 'Dashboard - Stack Template',
};

export default async function Page() {
  const organizationSlug = await ServerAuthService.getFirstOrganizationSlug();

  if (organizationSlug) {
    return redirect(`/dashboard/${organizationSlug}`);
  }

  return <PageClient />;
}
