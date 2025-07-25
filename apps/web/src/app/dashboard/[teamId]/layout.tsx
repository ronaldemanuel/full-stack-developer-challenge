import { notFound } from 'next/navigation';
import { ServerAuthService } from '@/auth/server';
import { OrganizationSwitcher } from '@/components/auth/organization-switcher';

import type { SidebarItem } from '../../../components/shared/sidebar-layout';
import { SidebarLayout } from '../../../components/shared/sidebar-layout';

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
      navigationItems={navigationItems}
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

const navigationItems: SidebarItem[] = [
  {
    name: 'Overview',
    href: '/',
    iconPath: ['sidebar', 'dashboard', 'overview'],
    type: 'item',
  },
  {
    type: 'label',
    name: 'Management',
  },
  {
    name: 'Posts',
    href: '/posts',
    iconPath: ['sidebar', 'dashboard', 'posts'],
    type: 'item',
  },
  {
    type: 'label',
    name: 'Settings',
  },
  {
    name: 'Configuration',
    href: '/configuration',
    iconPath: ['sidebar', 'dashboard', 'configuration'],
    type: 'item',
  },
];
