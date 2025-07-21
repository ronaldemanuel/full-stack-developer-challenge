import { LandingPageFooter } from './_components/landing-page-footer';
import { LandingPageHeader } from './_components/landing-page-header';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader
        items={[
          { title: 'Home', href: '/' },
          { title: 'Features', href: '/#features' },
          { title: 'Pricing', href: '/#pricing' },
          {
            title: 'Github',
            href: 'https://github.com/lisbom-dev/nx-ddd-template',
            external: true,
          },
        ]}
      />
      <main className="flex-1">{props.children}</main>
      <LandingPageFooter
        builtBy="Lisbom"
        builtByLink="https://lisbom.com.br/"
        githubLink="https://github.com/lisbom-dev/nx-ddd-template"
        twitterLink="https://twitter.com/stack_auth"
        linkedinLink="linkedin.com/company/stack-auth"
      />
    </div>
  );
}
