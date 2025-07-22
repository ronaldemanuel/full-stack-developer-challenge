import { Tabs } from '@nx-ddd/ui';

import { SignIn } from './_components/sign-in';
import { SignUp } from './_components/sign-up';

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center justify-center md:py-10">
        <div className="md:w-[400px]">
          <Tabs
            tabs={[
              {
                title: 'Sign In',
                value: 'sign-in',
                content: <SignIn />,
              },
              {
                title: 'Sign Up',
                value: 'sign-up',
                content: <SignUp />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
