import { Compass, FlaskConical, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TopBarActions } from '@/app/layouts/TopBarActions';
import { useDataAdapter } from '@/data/useDataAdapter';
import { usePreferences } from '@/shared/stores/preferences';
import { useCurrentUser } from '@/data/queries';

function DemoBadge() {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-800 ring-1 ring-inset ring-warning-200">
      <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
      {t('topbar.demoBadge')}
    </span>
  );
}

export function TopBar() {
  const { t } = useTranslation();
  const adapter = useDataAdapter();
  const collapsed = usePreferences((state) => state.sidebarCollapsed);
  const toggleSidebar = usePreferences((state) => state.toggleSidebar);
  const { data: user } = useCurrentUser();
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  const rankLabel = user
    ? user.customRankName ?? t(`roles.${user.role}`)
    : '';

  return (
    <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-app px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? t('topbar.expandSidebar') : t('topbar.collapseSidebar')}
          aria-expanded={!collapsed}
          className="hidden h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-all hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 lg:flex"
        >
          <ToggleIcon className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
        </button>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-900 shadow-sm lg:hidden">
          <Compass className="h-5 w-5 text-white" aria-hidden="true" />
        </span>

        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          {user && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-primary-900">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-app-secondary">{rankLabel}</p>
            </div>
          )}
        </div>

        {adapter.mode === 'demo' && <DemoBadge />}
      </div>

      <TopBarActions />
    </header>
  );
}
