import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn('h-5 w-5 animate-spin text-accent-600', className)}
      aria-hidden="true"
    />
  );
}
