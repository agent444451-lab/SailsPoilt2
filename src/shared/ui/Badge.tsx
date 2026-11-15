import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
  info: 'bg-accent-50 text-accent-700 ring-accent-100',
  success: 'bg-success-50 text-success-700 ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  error: 'bg-error-50 text-error-700 ring-error-200',
};

const DOT_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-400',
  info: 'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
  dot,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
        TONE_CLASSES[tone],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASSES[tone])} aria-hidden="true" />}
      {children}
    </span>
  );
}
