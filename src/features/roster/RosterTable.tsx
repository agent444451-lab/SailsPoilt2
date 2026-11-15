import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { Badge, type BadgeTone } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Pagination } from '@/shared/ui/Pagination';
import { EmptyState } from '@/shared/ui/EmptyState';
import { cn } from '@/shared/utils/cn';
import type { RosterMember, RosterStatus } from '@/features/roster/rosterApi';

const STATUS_TONE: Record<RosterStatus, BadgeTone> = {
  Active: 'success',
  Suspended: 'error',
};

type SortKey = 'name' | 'userId' | 'rank' | 'branch' | 'status';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

export function RosterTable({
  members,
  rankName,
  onEdit,
  onRemove,
}: {
  members: RosterMember[];
  rankName?: (member: RosterMember) => string | null;
  onEdit: (member: RosterMember) => void;
  onRemove: (member: RosterMember) => void;
}) {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...members].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = (a.fullNameEn ?? '').localeCompare(b.fullNameEn ?? '');
          break;
        case 'userId':
          cmp = (a.userId ?? '').localeCompare(b.userId ?? '');
          break;
        case 'rank': {
          const ra = rankName ? rankName(a) ?? '' : '';
          const rb = rankName ? rankName(b) ?? '' : '';
          cmp = ra.localeCompare(rb);
          break;
        }
        case 'branch':
          cmp = (a.branchName ?? '').localeCompare(b.branchName ?? '');
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return cmp * dir;
    });
  }, [members, sortKey, sortDir, rankName]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => {
    if (!active) return <ChevronsUpDown className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />;
    return dir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
    );
  };

  const thBase = 'px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-neutral-500 whitespace-nowrap';
  const tdBase = 'px-4 py-3.5 text-sm';

  if (members.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-2xl border border-app bg-surface shadow-sm">
        <table className="min-w-full divide-y divide-app-soft text-sm">
          <thead className="bg-neutral-50/80">
            <tr>
              <th scope="col" className={thBase}>
                <button
                  type="button"
                  onClick={() => toggleSort('name')}
                  className="flex items-center gap-1.5 hover:text-primary-900 transition-colors"
                >
                  {t('roster.columns.person')}
                  <SortIcon active={sortKey === 'name'} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className={thBase}>
                <button
                  type="button"
                  onClick={() => toggleSort('userId')}
                  className="flex items-center gap-1.5 hover:text-primary-900 transition-colors"
                >
                  {t('roster.columns.userId')}
                  <SortIcon active={sortKey === 'userId'} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className={thBase}>
                <button
                  type="button"
                  onClick={() => toggleSort('rank')}
                  className="flex items-center gap-1.5 hover:text-primary-900 transition-colors"
                >
                  {t('roster.columns.rank')}
                  <SortIcon active={sortKey === 'rank'} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className={thBase}>
                <button
                  type="button"
                  onClick={() => toggleSort('branch')}
                  className="flex items-center gap-1.5 hover:text-primary-900 transition-colors"
                >
                  {t('roster.columns.branch')}
                  <SortIcon active={sortKey === 'branch'} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className={thBase}>{t('roster.columns.team')}</th>
              <th scope="col" className={thBase}>
                <button
                  type="button"
                  onClick={() => toggleSort('status')}
                  className="flex items-center gap-1.5 hover:text-primary-900 transition-colors"
                >
                  {t('roster.columns.status')}
                  <SortIcon active={sortKey === 'status'} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className={cn(thBase, 'text-end')}>
                <span className="sr-only">{t('roster.columns.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-soft">
            {paged.map((member) => {
              const rank = rankName ? rankName(member) : null;
              return (
                <tr
                  key={member.id}
                  className="group transition-colors hover:bg-neutral-50/60"
                >
                  <td className={tdBase}>
                    <div className="flex flex-col">
                      <span className="font-medium text-primary-900" dir="auto">
                        {member.fullNameEn}
                      </span>
                      {member.fullNameAr && (
                        <span className="text-xs text-neutral-500" dir="auto">
                          {member.fullNameAr}
                        </span>
                      )}
                      <span className="text-xs text-neutral-400" dir="ltr">
                        {member.email}
                      </span>
                    </div>
                  </td>
                  <td className={cn(tdBase, 'font-mono text-neutral-600')} dir="ltr">
                    {member.userId}
                  </td>
                  <td className={tdBase}>
                    {rank ? (
                      <Badge tone="info">{rank}</Badge>
                    ) : (
                      <span className="text-xs text-neutral-400">{t('common.none')}</span>
                    )}
                  </td>
                  <td className={cn(tdBase, 'text-neutral-600')}>
                    {member.branchName ?? t('common.none')}
                  </td>
                  <td className={cn(tdBase, 'text-neutral-600')}>
                    {member.teamName ?? t('common.none')}
                  </td>
                  <td className={tdBase}>
                    <Badge tone={STATUS_TONE[member.status]} dot>
                      {t(`roster.status.${member.status}`)}
                    </Badge>
                  </td>
                  <td className={cn(tdBase, 'text-end')}>
                    {member.canManage && (
                      <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(member)}
                          aria-label={t('roster.actions.edit')}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="hidden xl:inline">{t('roster.actions.edit')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove(member)}
                          aria-label={t('roster.actions.remove')}
                          className="text-error-700 hover:bg-error-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="hidden xl:inline">{t('roster.actions.remove')}</span>
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            {t('common.showing')} {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, sorted.length)} {t('common.of')} {sorted.length}
          </p>
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

export function RosterEmptyResult() {
  const { t } = useTranslation();
  return <EmptyState title={t('roster.noMatches')} body={t('roster.searchPlaceholder')} />;
}
