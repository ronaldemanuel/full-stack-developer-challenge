import type { SidebarItem } from '@/components/shared/sidebar-layout';
import Link from 'next/link';
import { SidebarLayout } from '@/components/shared/sidebar-layout';

import { Button } from '@nx-ddd/ui';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <SidebarLayout
      basePath=""
      sidebarTop={
        <Button variant="link">
          <Link href="/dashboard">Stack Template</Link>
        </Button>
      }
      navigationItems={navigationItems}
      baseBreadcrumb={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}

const navigationItems: SidebarItem[] = [
  {
    name: 'Account Settings',
    type: 'label',
  },
  {
    name: 'My Profile',
    href: '/user/profile',
    iconPath: ['sidebar', 'settings', 'profile'],
    type: 'item',
  },
  {
    name: 'Email & Auth',
    href: '/user/auth',
    iconPath: ['sidebar', 'settings', 'auth'],
    type: 'item',
  },
  {
    name: 'Settings',
    href: '/user/settings',
    iconPath: ['sidebar', 'settings', 'settings'],
    type: 'item',
  },
  {
    name: 'Teams',
    type: 'label',
  },
];
