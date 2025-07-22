import { ThemeProvider } from 'next-themes';

import { Toaster } from '@nx-ddd/ui';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
