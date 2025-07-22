import { notFound } from 'next/navigation';
import { getOrganizationInfo } from '@/auth/server';

import SidebarLayout from './_components/sidebar-layout';

interface Props {
  children: React.ReactNode;
  params: Promise<{
    teamId: string;
  }>;
}

export default async function Layout(props: Props) {
  const { teamId } = await props.params;
  const organization = await getOrganizationInfo(teamId);
  const hasAccess = organization !== null;

  if (!hasAccess) {
    return notFound();
  }

  return (
    <SidebarLayout
      basePath={`/dashboard/${teamId}`}
      // TODO: Implement selected team switcher
      // sidebarTop={
      //   <SelectedTeamSwitcher
      //     selectedTeam={team}
      //     urlMap={(team) => `/dashboard/${team.id}`}
      //   />
      // }
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
