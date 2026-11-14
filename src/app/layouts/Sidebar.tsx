import { NavLink } from 'react-router-dom';
import { Compass, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVisibleNavSections } from '@/app/layouts/useVisibleNavItems';
import { usePreferences } from '@/shared/stores/preferences';
import { useCurrentUser } from '@/data/queries';
import { useAuth } from '@/features/auth/useAuth';
import { cn } from '@/shared/utils/cn';

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Sidebar() {
  const { t, i18n } = useTranslation();
  const sections = useVisibleNavSections();
  const collapsed = usePreferences((state) => state.sidebarCollapsed);
  const { data: user } = useCurrentUser();
  const { signOut } = useAuth();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col bg-sidebar text-sidebar transition-[width] duration-250 ease-out-expo lg:flex',
        'shadow-sidebar',
        collapsed ? 'lg:w-[4.75rem]' : 'lg:w-64'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-3 px-5',
          collapsed && 'justify-center px-0'
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-500 shadow-sm">
          <Compass className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <span className="block truncate text-sm font-semibold text-sidebar-active">
              {t('app.name')}
            </span>
            <span className="block truncate text-2xs text-sidebar">{t('app.tagline')}</span>
          </div>
        )}
      </div>

      {/* Nav sections */}
      <nav
        aria-label={t('nav.primary')}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4"
      >
        <div className="flex flex-col gap-5">
          {sections.map((section) => (
            <div key={section.key}>
              {!collapsed && (
                <h2
                  className="mb-1.5 px-3 text-2xs font-semibold uppercase tracking-wider text-sidebar"
                  style={{ opacity: 0.5 }}
                >
                  {t(`nav.sections.${section.key}`)}
                </h2>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const label = t(`nav.${item.key}`);
                  const Icon = item.icon;
                  return (
                    <li key={item.key}>
                      <NavLink
                        to={item.path}
                        end
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                            collapsed && 'justify-center px-0',
                            isActive
                              ? 'bg-sidebar-active text-sidebar-active'
                              : 'text-sidebar hover:bg-sidebar-hover hover:text-sidebar-active'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && !collapsed && (
                              <span
                                className={cn(
                                  'absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-accent-500',
                                  isRtl ? 'right-0' : 'left-0'
                                )}
                              />
                            )}
                            <Icon
                              className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110"
                              aria-hidden="true"
                            />
                            {!collapsed && <span className="truncate">{label}</span>}
                            {collapsed && <span className="sr-only">{label}</span>}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User card */}
      {user && (
        <div
          className={cn(
            'shrink-0 border-t border-sidebar p-3',
            collapsed && 'px-0'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg p-2',
              collapsed && 'justify-center'
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold text-white shadow-sm">
              {initialsOf(user.displayName)}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-active">
                  {user.displayName}
                </p>
                <p className="truncate text-xs text-sidebar">
                  {user.customRankName ?? t(`roles.${user.role}`)}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={() => void signOut()}
                aria-label={t('auth.signOut')}
                title={t('auth.signOut')}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar transition-colors hover:bg-sidebar-hover hover:text-sidebar-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <LogOut className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}


