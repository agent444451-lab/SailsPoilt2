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
        className="flex min-h-10 items-center gap-2 rounded-full ps-1 pe-2 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
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
        <ChevronDown className="hidden h-4 w-4 text-neutral-500 sm:block" aria-hidden="true" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-72 animate-scale-in rounded-xl border border-app bg-surface p-2 shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="text-xs text-app-muted">{t('topbar.signedInAs')}</p>
            <p className="text-sm font-semibold text-primary-900">{user.displayName}</p>
            <p className="text-xs text-app-secondary">
              {user.customRankName ?? t(`roles.${user.role}`)}
            </p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-neutral-200" />

          <DropdownMenu.Item asChild>
            <NavLink
              to="/profile"
              className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm text-primary-900 outline-none data-[highlighted]:bg-neutral-100"
            >
              <UserCircle className="h-4 w-4 text-neutral-500" aria-hidden="true" />
              {t('nav.profile')}
            </NavLink>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => void signOut()}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm text-primary-900 outline-none data-[highlighted]:bg-neutral-100"
          >
            <LogOut className="h-4 w-4 text-neutral-500 rtl:rotate-180" aria-hidden="true" />
            {t('auth.signOut')}
          </DropdownMenu.Item>

          {SHOW_DEMO_ROLE_SWITCHER && (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-neutral-200" />
              <DemoRoleSwitcherItems />
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function TopBarActions() {
  const { t } = useTranslation();
  const unreadCount = useNotifications().data?.unreadCount ?? 0;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <NavLink
        to="/notifications"
        aria-label={t('topbar.notifications')}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className={cn(
              'absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-error-600 px-1 text-[10px] font-semibold text-white shadow-sm',
              unreadCount > 0 && 'animate-pulse-ring'
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </NavLink>

      <UserMenu />
    </div>
  );
}
