import { ReactQueryProvider } from '@/lib/providers/react-query';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </ReactQueryProvider>
  );
}
