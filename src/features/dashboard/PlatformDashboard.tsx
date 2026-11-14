import { Building2, ClipboardCheck, KeyRound, ShieldCheck, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPlatformStats } from '@/features/roster/rosterApi';
import { StatCard } from '@/features/dashboard/StatCard';
import { ErrorState } from '@/shared/ui/ErrorState';
import { PageHeader } from '@/shared/ui/PageHeader';

export function PlatformDashboard() {
  const { t } = useTranslation();
  const stats = useQuery({ queryKey: ['platform', 'stats'], queryFn: fetchPlatformStats });

  return (
    <>
      <PageHeader
        title={t('dashboard.platformTitle')}
        description={t('dashboard.platformSubtitle')}
      />
      {stats.isError ? (
        <div className="mt-8">
          <ErrorState onRetry={() => void stats.refetch()} />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label={t('dashboard.platformCompanies')}
            value={stats.data?.companies}
            icon={Building2}
            tone="accent"
            index={0}
          />
          <StatCard
            label={t('dashboard.platformCompanyAdmins')}
            value={stats.data?.companyAdmins}
            icon={ShieldCheck}
            tone="primary"
            index={1}
          />
          <StatCard
            label={t('dashboard.platformEmployees')}
            value={stats.data?.employees}
            icon={Users}
            tone="success"
            index={2}
          />
          <StatCard
            label={t('dashboard.platformPendingRequests')}
            value={stats.data?.pendingPasswordRequests}
            icon={KeyRound}
            tone="warning"
            index={3}
          />
          <StatCard
            label={t('dashboard.platformRecentApproved')}
            value={stats.data?.recentlyApprovedPasswordRequests}
            icon={ClipboardCheck}
            tone="error"
            index={4}
          />
        </div>
      )}
    </>
  );
}
