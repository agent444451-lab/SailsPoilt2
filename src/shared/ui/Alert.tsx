import type { ReactNode } from 'react';
import { CheckCircle2, Info, TriangleAlert, XCircle, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type AlertTone = 'success' | 'error' | 'warning' | 'info';

const TONE_CONFIG: Record<
  AlertTone,
  { container: string; icon: string; Icon: typeof Info }
> = {
  success: {
    container: 'bg-success-50 border-success-200 text-success-800',
    icon: 'text-success-600',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-error-50 border-error-200 text-error-800',
    icon: 'text-error-600',
    Icon: XCircle,
  },
  warning: {
    container: 'bg-warning-50 border-warning-200 text-warning-800',
    icon: 'text-warning-600',
    Icon: TriangleAlert,
  },
  info: {
    container: 'bg-accent-50 border-accent-100 text-accent-700',
    icon: 'text-accent-600',
    Icon: Info,
  },
};

export function Alert({
  tone = 'info',
  children,
  onClose,
  className,
}: {
  tone?: AlertTone;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const config = TONE_CONFIG[tone];
  const Icon = config.Icon;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-fade-in',
        config.container,
        className
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.icon)} aria-hidden="true" />
      <div className="min-w-0 flex-1 leading-relaxed">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className={cn(
            'mt-0.5 shrink-0 rounded-md p-0.5 transition-colors hover:bg-black/5',
            config.icon
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
