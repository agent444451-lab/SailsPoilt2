import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  ClipboardCheck,
  FileUp,
  GitBranch,
  KeyRound,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
  UsersRound,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  useBranches,
  useCompany,
  useCurrentUser,
  useEmployees,
  useSales,
  useTeams,
} from '@/data/queries';
import { PlatformDashboard } from '@/features/dashboard/PlatformDashboard';
import { StatCard, DashboardCard } from '@/features/dashboard/StatCard';
import { usePreferences } from '@/shared/stores/preferences';
import { can } from '@/domain/permissions';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Skeleton } from '@/shared/ui/Skeleton';

interface QuickAction {
  key: string;
  path: string;
  icon: LucideIcon;
  action: string;
}

const QUICK_ACTIONS: readonly QuickAction[] = [
  { key: 'sales', path: '/sales', icon: Receipt, action: 'sale.view' },
  { key: 'salesImport', path: '/sales/import', icon: FileUp, action: 'sale.import' },
  { key: 'employees', path: '/employees', icon: Users, action: 'employee.view' },
  { key: 'reports', path: '/reports', icon: TrendingUp, action: 'report.view' },
];

export function DashboardPage() {
  const { t } = useTranslation();
  const language = usePreferences((state) => state.language);
  const { data: user } = useCurrentUser();
  const company = useCompany();
  const branches = useBranches();
  const teams = useTeams();
  const employees = useEmployees();
  const sales = useSales();

  if (!user) return null;

  if (!user.companyId) return <PlatformDashboard />;

  const queries = [company, branches, teams, employees, sales];
  const hasError = queries.some((query) => query.isError);
  const companyName = company.data
    ? language === 'ar'
      ? company.data.nameAr
      : company.data.name
    : '';
  const isLoading = queries.some((q) => q.isPending);

  const visibleActions = QUICK_ACTIONS.filter((a) => can(user, a.action as never));

  if (hasError) {
    return (
      <>
        <PageHeader
          title={t('dashboard.greeting', { name: user.displayName })}
          description={t('dashboard.subtitle', { company: companyName })}
        />
        <div className="mt-8">
          <ErrorState onRetry={() => queries.forEach((query) => void query.refetch())} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('dashboard.greeting', { name: user.displayName })}
        description={t('dashboard.subtitle', { company: companyName })}
      />

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('dashboard.statEmployees')}
          value={employees.data?.length}
          icon={Users}
          tone="accent"
          index={0}
        />
        <StatCard
          label={t('dashboard.statSales')}
          value={sales.data?.length}
          icon={Receipt}
          tone="success"
          index={1}
        />
        <StatCard
          label={t('dashboard.statBranches')}
          value={branches.data?.length}
          icon={GitBranch}
          tone="warning"
          index={2}
        />
        <StatCard
          label={t('dashboard.statTeams')}
          value={teams.data?.length}
          icon={UsersRound}
          tone="primary"
          index={3}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Quick actions */}
        {visibleActions.length > 0 && (
          <DashboardCard
            title={t('dashboard.quickActions')}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {visibleActions.map((action) => {
                const Icon = action.icon;
                return (
                  <NavLink
                    key={action.key}
                    to={action.path}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-app-soft p-4 text-center transition-all duration-200 hover:border-neutral-300 hover:shadow-sm"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700 transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-medium text-primary-900">
                      {t(`nav.${action.key}`)}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </DashboardCard>
        )}

        {/* Company snapshot */}
        <DashboardCard
          title={t('dashboard.overviewCard')}
          description={t('dashboard.overviewCardBody')}
        >
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <SnapshotRow
                icon={Building2}
                label={t('dashboard.scopeCompany')}
                value={companyName || '—'}
              />
              <SnapshotRow
                icon={Users}
                label={t('dashboard.statEmployees')}
                value={employees.data ? `${employees.data.length}` : '—'}
              />
              <SnapshotRow
                icon={Receipt}
                label={t('dashboard.statSales')}
                value={sales.data ? `${sales.data.length}` : '—'}
              />
            </div>
          )}
        </DashboardCard>
      </div>
    </>
  );
}

function SnapshotRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-app-soft px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-app-muted" aria-hidden="true" />
      <span className="flex-1 text-sm text-app-secondary">{label}</span>
      <span className="text-sm font-medium text-primary-900">{value}</span>
    </div>
  );
}

/* re-export for platform dashboard to use */
export { StatCard, DashboardCard, ClipboardCheck, KeyRound, ShieldCheck, LayoutDashboard };
