import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/shared/i18n/useFormatters';
import { Card } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/utils/cn';

const TONE_CLASSES: Record<string, { bg: string; bar: string }> = {
  accent: { bg: 'bg-accent-50 text-accent-700', bar: 'bg-accent-500' },
  success: { bg: 'bg-success-50 text-success-700', bar: 'bg-success-500' },
  warning: { bg: 'bg-warning-50 text-warning-700', bar: 'bg-warning-500' },
  error: { bg: 'bg-error-50 text-error-700', bar: 'bg-error-500' },
  primary: { bg: 'bg-primary-soft text-primary-900', bar: 'bg-primary-500' },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'accent',
  index = 0,
  trend,
}: {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  tone?: 'accent' | 'success' | 'warning' | 'error' | 'primary';
  index?: number;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
}) {
  const f = useFormatters();
  const toneClass = TONE_CLASSES[tone] ?? TONE_CLASSES.accent;

  return (
    <Card
      interactive
      className="group relative flex animate-fade-in-up items-center gap-4 overflow-hidden p-5"
    >
      <span
        className={cn(
          'absolute inset-y-0 start-0 w-1 transition-opacity group-hover:opacity-80',
          toneClass.bar
        )}
        style={{ animationDelay: `${index * 60}ms` }}
        aria-hidden="true"
      />
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110',
          toneClass.bg
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-app-secondary">{label}</p>
        {value === undefined ? (
          <Skeleton className="mt-1.5 h-7 w-20" />
        ) : (
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tabular-nums text-primary-900">
              {f.number(value)}
            </p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.direction === 'up' && 'text-success-600',
                  trend.direction === 'down' && 'text-error-600',
                  trend.direction === 'neutral' && 'text-neutral-500'
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export function DashboardCard({
  title,
  description,
  children,
  className,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  const { t: _t } = useTranslation();
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-4 border-b border-app-soft p-5">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-primary-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-app-secondary">{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}
