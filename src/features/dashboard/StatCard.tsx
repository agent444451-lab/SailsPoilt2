import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/shared/i18n/useFormatters';
import { Card } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'accent',
  index = 0,
}: {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  tone?: 'accent' | 'success' | 'warning' | 'error' | 'primary';
  index?: number;
}) {
  const f = useFormatters();

  const toneClasses: Record<string, string> = {
    accent: 'bg-accent-50 text-accent-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    error: 'bg-error-50 text-error-700',
    primary: 'bg-primary-soft text-primary-900',
  };

  return (
    <Card
      interactive
      className="flex animate-fade-in-up items-center gap-4 p-5"
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform hover:scale-110 ${toneClasses[tone]}`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-app-secondary">{label}</p>
        {value === undefined ? (
          <Skeleton className="mt-1.5 h-7 w-20" />
        ) : (
          <p className="text-2xl font-semibold tabular-nums text-primary-900">
            {f.number(value)}
          </p>
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
