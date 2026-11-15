import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, Trash2 } from 'lucide-react';
import { useNotifications, useNotificationActions } from '@/features/notifications/useNotifications';
import type { AppNotification } from '@/features/roster/rosterApi';
import { usePreferences } from '@/shared/stores/preferences';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Skeleton } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/utils/cn';

const TYPE_ICON: Record<string, typeof Bell> = {
  password_request_created: Clock,
  password_request_approved: Check,
  password_request_rejected: Trash2,
};

function NotificationRow({ item }: { item: AppNotification }) {
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const navigate = useNavigate();
  const { markRead, remove } = useNotificationActions();
  const unread = item.read_at === null;
  const Icon = TYPE_ICON[item.type] ?? Bell;

  const open = () => {
    if (unread) markRead.mutate(item.id);
    if (item.link_path) navigate(item.link_path);
  };

  return (
    <li
      className={cn(
        'group flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
        unread && 'bg-accent-50/40'
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            unread ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-400'
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className={cn('text-sm', unread ? 'font-semibold text-primary-900' : 'font-medium text-neutral-700')}>
              {t(`notifications.types.${item.type}`, { defaultValue: item.title })}
            </p>
            {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent-600" aria-hidden="true" />}
          </div>
          {item.title && item.title !== t(`notifications.types.${item.type}`, { defaultValue: item.title }) && (
            <p className="truncate text-sm text-neutral-600">{item.title}</p>
          )}
          {item.body && <p className="truncate text-xs text-neutral-500">{item.body}</p>}
          <p className="mt-1 text-xs text-neutral-400">
            {new Date(item.created_at).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 ps-12 sm:ps-0">
        {item.link_path && (
          <Button variant="outline" size="sm" onClick={open}>
            {t('notifications.open')}
          </Button>
        )}
        {unread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markRead.mutate(item.id)}
            className="text-accent-700 hover:bg-accent-50"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t('notifications.markRead')}</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => remove.mutate(item.id)}
          className="text-error-700 hover:bg-error-50"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{t('notifications.delete')}</span>
        </Button>
      </div>
    </li>
  );
}

export function NotificationsPage() {
  const { t } = useTranslation();
  const query = useNotifications();
  const { markAllRead } = useNotificationActions();

  const items = query.data?.notifications;
  const unreadCount = query.data?.unreadCount ?? 0;

  return (
    <>
      <PageHeader
        title={t('nav.notifications')}
        description={t('sections.notifications.description')}
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" onClick={() => markAllRead.mutate()}>
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              {t('notifications.markAllRead')}
            </Button>
          ) : undefined
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span>{unreadCount} {t('notifications.title')}</span>
          </div>
        )}

        {query.isError && (
          <Card>
            <ErrorState onRetry={() => void query.refetch()} />
          </Card>
        )}

        {items === undefined && !query.isError && (
          <div className="flex flex-col gap-3 rounded-2xl border border-app bg-surface p-4 shadow-sm" role="status">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {items && items.length === 0 && (
          <Card>
            <EmptyState
              icon={<Bell className="h-7 w-7" aria-hidden="true" />}
              title={t('notifications.empty')}
            />
          </Card>
        )}

        {items && items.length > 0 && (
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-app-soft">
              {items.map((item) => (
                <NotificationRow key={item.id} item={item} />
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}
