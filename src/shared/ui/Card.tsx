import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export function Card({
  className,
  children,
  interactive,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-app bg-surface shadow-sm',
        interactive &&
          'transition-all duration-200 ease-out-expo hover:shadow-md hover:border-neutral-300',
        className
      )}
    >
      {children}
    </section>
  );
}
