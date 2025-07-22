import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getFirstOrganizationSlug } from '@/auth/server';

import { PageClient } from './page-client';

export const metadata: Metadata = {
  title: 'Dashboard - Stack Template',
};

export default async function Page() {
  const organizationSlug = await getFirstOrganizationSlug();

  if (organizationSlug) {
    return redirect(`/dashboard/${organizationSlug}`);
  }

  return <PageClient />;
}
