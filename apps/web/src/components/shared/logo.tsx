import Link from 'next/link';

import { cn } from '@nx-ddd/ui-utils';

export function Logo(props: { className?: string; link?: string }) {
  return (
    <Link
      href={props.link ?? '/'}
      className={cn('items-center space-x-2', props.className)}
    >
      <span className="font-bold sm:inline-block">Stack Template</span>
    </Link>
  );
}
