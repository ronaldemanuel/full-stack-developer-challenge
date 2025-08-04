interface Props {
  params: Promise<{
    teamId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { teamId } = await params;

  return <div>Team Settings, teamId: {teamId}</div>;
}
