import { Bell, ChevronDown, LogOut, CircleUser as UserCircle } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@/data/queries';
import { DemoRoleSwitcherItems } from '@/app/dev/DemoRoleSwitcherItems';
import { SHOW_DEMO_ROLE_SWITCHER } from '@/shared/constants/env';
import { useAuth } from '@/features/auth/useAuth';
import { useNotifications } from '@/features/notifications/useNotifications';
import { cn } from '@/shared/utils/cn';

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function UserMenu() {
  const { t, i18n } = useTranslation();
  const { data: user } = useCurrentUser();
  const { signOut } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu.Root dir={i18n.dir()}>
      <DropdownMenu.Trigger
        aria-label={t('topbar.userMenu')}
        className="flex min-h-10 items-center gap-2 rounded-full ps-1 pe-2 transition-all hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-900 text-xs font-semibold text-white shadow-sm">
          {initialsOf(user.displayName)}
        </span>
        <span className="hidden text-start sm:block">
          <span className="block text-sm font-medium text-primary-900">
            {user.displayName}
          </span>
          <span className="block text-xs text-app-secondary">
            {user.customRankName ?? t(`roles.${user.role}`)}
          </span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-neutral-400 transition-transform data-[state=open]:rotate-180 sm:block" aria-hidden="true" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-72 animate-scale-in rounded-xl border border-app bg-surface p-2 shadow-lg"
        >
          <div className="flex items-center gap-3 rounded-lg bg-neutral-50 px-3 py-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-900 text-xs font-semibold text-white">
              {initialsOf(user.displayName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary-900">{user.displayName}</p>
              <p className="truncate text-xs text-app-secondary">
                {user.customRankName ?? t(`roles.${user.role}`)}
              </p>
            </div>
          </div>

          <DropdownMenu.Separator className="my-1.5 h-px bg-app-soft" />

          <DropdownMenu.Item asChild>
            <NavLink
              to="/profile"
              className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm text-primary-900 outline-none transition-colors data-[highlighted]:bg-neutral-100"
            >
              <UserCircle className="h-4 w-4 text-neutral-500" aria-hidden="true" />
              {t('nav.profile')}
            </NavLink>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => void signOut()}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm text-error-700 outline-none transition-colors data-[highlighted]:bg-error-50"
          >
            <LogOut className="h-4 w-4 text-error-600 rtl:rotate-180" aria-hidden="true" />
            {t('auth.signOut')}
          </DropdownMenu.Item>

          {SHOW_DEMO_ROLE_SWITCHER && (
            <>
              <DropdownMenu.Separator className="my-1.5 h-px bg-app-soft" />
              <DemoRoleSwitcherItems />
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function NotificationBell() {
  const { t, i18n } = useTranslation();
  const query = useNotifications();
  const unreadCount = query.data?.unreadCount ?? 0;
  const notifications = query.data?.notifications ?? [];
  const recent = notifications.slice(0, 5);

  return (
    <DropdownMenu.Root dir={i18n.dir()}>
      <DropdownMenu.Trigger
        aria-label={t('topbar.notifications')}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-all hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className={cn(
              'absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-error-600 px-1 text-[10px] font-semibold text-white shadow-sm',
              'animate-pulse-ring'
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 animate-scale-in rounded-xl border border-app bg-surface p-0 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-app-soft px-4 py-3">
            <h3 className="text-sm font-semibold text-primary-900">{t('nav.notifications')}</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">
                {unreadCount} {t('notifications.title')}
              </span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-neutral-500">{t('notifications.empty')}</p>
            ) : (
              <ul className="divide-y divide-app-soft">
                {recent.map((item) => {
                  const unread = item.read_at === null;
                  return (
                    <NavLink
                      key={item.id}
                      to={item.link_path ?? '/notifications'}
                      className="flex items-start gap-2.5 px-4 py-3 transition-colors hover:bg-neutral-50"
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          unread ? 'bg-accent-600' : 'bg-transparent'
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={cn('truncate text-sm', unread ? 'font-medium text-primary-900' : 'text-neutral-600')}>
                          {t(`notifications.types.${item.type}`, { defaultValue: item.title })}
                        </p>
                        <p className="truncate text-xs text-neutral-400">
                          {new Date(item.created_at).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </NavLink>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="border-t border-app-soft p-2">
            <NavLink
              to="/notifications"
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-accent-700 transition-colors hover:bg-accent-50"
            >
              {t('dashboard.viewAll')}
            </NavLink>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function TopBarActions() {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <NotificationBell />
      <UserMenu />
    </div>
  );
}
