import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Clock, X } from 'lucide-react';
import { Badge, type BadgeTone } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { SearchBar } from '@/shared/ui/SearchBar';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Pagination } from '@/shared/ui/Pagination';
import { usePasswordRequests, useReviewPasswordRequest } from '@/features/roster/useRoster';

type RequestStatus = 'pending' | 'approved' | 'rejected';

const STATUS_TONE: Record<RequestStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const PAGE_SIZE = 8;

export function PasswordRequestsPage() {
  const { t } = useTranslation();
  const query = usePasswordRequests();
  const review = useReviewPasswordRequest();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const items = query.data?.requests ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !term ||
        [item.fullNameEn, item.fullNameAr, item.email, item.userId].some((field) =>
          (field ?? '').toLowerCase().includes(term)
        );
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  const filterButtons: { key: RequestStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: t('common.filterAll'), count: items.length },
    { key: 'pending', label: t('passwordRequests.status.pending'), count: pendingCount },
    { key: 'approved', label: t('passwordRequests.status.approved'), count: items.filter((i) => i.status === 'approved').length },
    { key: 'rejected', label: t('passwordRequests.status.rejected'), count: items.filter((i) => i.status === 'rejected').length },
  ];

  return (
    <>
      <PageHeader
        title={t('passwordRequests.title')}
        description={t('passwordRequests.description')}
      />

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('common.search')}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => { setStatusFilter(btn.key); setPage(1); }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  statusFilter === btn.key
                    ? 'bg-primary-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {btn.label}
                <span className={`rounded-full px-1.5 text-[10px] ${statusFilter === btn.key ? 'bg-white/20' : 'bg-neutral-200'}`}>
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {query.isPending && (
          <div className="flex flex-col gap-3 rounded-2xl border border-app bg-surface p-4 shadow-sm" role="status">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}

        {query.isError && (
          <Card>
            <ErrorState onRetry={() => void query.refetch()} />
          </Card>
        )}

        {query.data && items.length === 0 && (
          <Card>
            <EmptyState
              title={t('passwordRequests.emptyTitle')}
              body={t('passwordRequests.emptyBody')}
            />
          </Card>
        )}

        {query.data && items.length > 0 && filtered.length === 0 && (
          <Card>
            <EmptyState title={t('roster.noMatches')} />
          </Card>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto rounded-2xl border border-app bg-surface shadow-sm">
              <table className="min-w-full divide-y divide-app-soft text-sm">
                <thead className="bg-neutral-50/80">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {t('passwordRequests.columns.employee')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {t('passwordRequests.columns.userId')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {t('passwordRequests.columns.requestedAt')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {t('passwordRequests.columns.status')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {t('passwordRequests.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-soft">
                  {paged.map((item) => (
                    <tr key={item.id} className="group transition-colors hover:bg-neutral-50/60">
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-medium text-primary-900" dir="auto">{item.fullNameEn}</span>
                          {item.fullNameAr && (
                            <span className="text-xs text-neutral-500" dir="auto">{item.fullNameAr}</span>
                          )}
                          <span className="text-xs text-neutral-400" dir="ltr">{item.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-neutral-600" dir="ltr">{item.userId}</td>
                      <td className="px-4 py-3.5 text-neutral-600 whitespace-nowrap">
                        {new Date(item.requestedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone={STATUS_TONE[item.status]} dot>
                          {item.status === 'pending' && <Clock className="h-3 w-3" aria-hidden="true" />}
                          {t(`passwordRequests.status.${item.status}`)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-end">
                        {item.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5 opacity-60 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={review.isPending}
                              onClick={() => review.mutate({ id: item.id, decision: 'approved' })}
                              className="text-success-700 hover:bg-success-50"
                            >
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="hidden sm:inline">{t('passwordRequests.approve')}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={review.isPending}
                              onClick={() => review.mutate({ id: item.id, decision: 'rejected' })}
                              className="text-error-700 hover:bg-error-50"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="hidden sm:inline">{t('passwordRequests.reject')}</span>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-neutral-500">
                  {t('common.showing')} {(safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, filtered.length)} {t('common.of')} {filtered.length}
                </p>
                <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
