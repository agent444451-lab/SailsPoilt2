import { cn } from '@/shared/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer animate-shimmer rounded-lg', className)}
    />
  );
}
