import { notFound } from 'next/navigation';
import { ServerAuthService } from '@/auth/server';
import { OrganizationSwitcher } from '@/components/auth/organization-switcher';

import SidebarLayout from './_components/sidebar-layout';

interface Props {
  children: React.ReactNode;
  params: Promise<{
    teamId: string;
  }>;
}

export default async function Layout(props: Props) {
  const { teamId } = await props.params;
  const organization = await ServerAuthService.getFullOrganization({
    organizationSlug: teamId,
  });
  const hasAccess = organization !== null;

  if (!hasAccess) {
    return notFound();
  }

  return (
    <SidebarLayout
      basePath={`/dashboard/${teamId}`}
      sidebarTop={<OrganizationSwitcher selectedOrganization={organization} />}
      baseBreadcrumb={[
        {
          title: organization.name,
          href: `/dashboard/${teamId}`,
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}
