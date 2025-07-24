/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideProps } from 'lucide-react';
import type {
  ForwardRefExoticComponent,
  LazyExoticComponent,
  RefAttributes,
} from 'react';
import { lazy } from 'react';

export type IconPlace = 'sidebar';

const icons = {
  sidebar: {
    dashboard: {
      overview: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Globe })),
      ),
      products: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.ShoppingBag })),
      ),
      people: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Users })),
      ),
      segments: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Columns3 })),
      ),
      regions: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Locate })),
      ),
      revenue: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.BarChart4 })),
      ),
      orders: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.ShoppingCart })),
      ),
      discounts: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.BadgePercent })),
      ),
      configuration: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Settings2 })),
      ),
    },
    settings: {
      profile: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.User })),
      ),
      auth: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Lock })),
      ),
      settings: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Settings2 })),
      ),
      teams: lazy(() =>
        import('lucide-react').then((m) => ({ default: m.Users })),
      ),
    },
  },
};

export function getIcon(
  iconPath: string[],
): LazyExoticComponent<
  ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
> {
  return iconPath.reduce((acc, path) => {
    return (acc as any)[path];
  }, icons) as any;
}
