import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <TRPCReactProvider>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </TRPCReactProvider>
  );
}
