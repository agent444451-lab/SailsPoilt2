import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

export function EmptyState({
  title,
  body,
  action,
  icon,
  className,
}: {
  title?: string;
  body?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'flex animate-fade-in flex-col items-center justify-center gap-4 px-6 py-16 text-center',
        className
      )}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-700 ring-4 ring-accent-50/50">
        {icon ?? <Inbox className="h-7 w-7" aria-hidden="true" />}
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-primary-900">
          {title ?? t('states.emptyTitle')}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-app-secondary">
          {body ?? t('states.emptyBody')}
        </p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
