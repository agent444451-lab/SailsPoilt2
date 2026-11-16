import { useMemo, useState } from 'react';
import { Upload, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Skeleton } from '@/shared/ui/Skeleton';
import { SearchBar } from '@/shared/ui/SearchBar';
import { Card } from '@/shared/ui/Card';
import type { RosterMember } from '@/features/roster/rosterApi';
import type { EditMemberSaveFields } from '@/features/roster/EditMemberDialog';
import { useRemoveRosterMember, useRanks, useRosterList, useUpdateRosterMember } from '@/features/roster/useRoster';
import { RosterTable, RosterEmptyResult } from '@/features/roster/RosterTable';
import { EditMemberDialog } from '@/features/roster/EditMemberDialog';
import { RemoveMemberDialog } from '@/features/roster/RemoveMemberDialog';
import { ImportRosterDialog } from '@/features/roster/ImportRosterDialog';

export function RosterPage() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const member: RosterMember | null = state.status === 'ready' ? state.member : null;
  const rosterQuery = useRosterList(member?.id ?? 'unknown');
  const ranksQuery = useRanks();
  const ranks = ranksQuery.data?.ranks ?? [];
  const updateMutation = useUpdateRosterMember();
  const removeMutation = useRemoveRosterMember();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<RosterMember | null>(null);
  const [removing, setRemoving] = useState<RosterMember | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const canImport = member?.role !== 'EMPLOYEE' || member?.customRankPermissions.includes('employee.import');

  const roster = rosterQuery.data;
  const visibleMembers = useMemo(() => {
    const members = roster?.members ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return members;
    return members.filter((person) =>
      [person.fullNameEn, person.fullNameAr, person.email, person.userId].some((field) =>
        (field ?? '').toLowerCase().includes(term)
      )
    );
  }, [roster, search]);

  const closeEdit = () => {
    setEditing(null);
    updateMutation.reset();
  };

  const closeRemove = () => {
    setRemoving(null);
    removeMutation.reset();
  };

  const saveEdit = (fields: EditMemberSaveFields) => {
    if (!editing) return;
    updateMutation.mutate(
      {
        id: editing.id,
        fields: {
          fullNameEn: fields.fullNameEn,
          fullNameAr: fields.fullNameAr,
          role: editing.role,
          status: fields.status,
          companyId: editing.companyId,
          branchId: fields.branchId,
          teamId: editing.teamId,
          customRankId: fields.customRankId,
        },
      },
      { onSuccess: closeEdit },
    );
  };

  const confirmRemove = () => {
    if (!removing) return;
    removeMutation.mutate(removing.id, { onSuccess: closeRemove });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('roster.title')}
        description={t('roster.description')}
        actions={
          canImport && (
            <Button onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" aria-hidden="true" />
              {t('roster.import.open')}
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('roster.searchPlaceholder')}
          />
          {roster && (
            <p className="text-sm text-neutral-500">
              {t('common.showing')} <span className="font-medium text-primary-900">{visibleMembers.length}</span> {t('common.of')} {roster.members.length} {t('roster.total', { count: roster.members.length })}
            </p>
          )}
        </div>

        {rosterQuery.isPending && <RosterSkeleton />}
        {rosterQuery.isError && (
          <Card>
            <ErrorState onRetry={() => void rosterQuery.refetch()} />
          </Card>
        )}
        {roster && roster.members.length === 0 && (
          <Card>
            <EmptyState
              icon={<Users className="h-7 w-7" aria-hidden="true" />}
              title={t('roster.emptyTitle')}
              body={t('roster.emptyBody')}
            />
          </Card>
        )}
        {roster && roster.members.length > 0 && visibleMembers.length === 0 && (
          <Card>
            <RosterEmptyResult />
          </Card>
        )}
        {visibleMembers.length > 0 && (
          <RosterTable
            members={visibleMembers}
            rankName={(m) => m.customRankName ?? ranks.find((r) => r.id === m.customRankId)?.nameAr ?? ranks.find((r) => r.id === m.customRankId)?.name ?? null}
            onEdit={setEditing}
            onRemove={setRemoving}
          />
        )}
      </div>

      {roster && (
        <EditMemberDialog
          member={editing}
          roster={roster}
          ranks={ranks}
          pending={updateMutation.isPending}
          error={updateMutation.isError}
          onSave={saveEdit}
          onOpenChange={(open) => {
            if (!open) closeEdit();
          }}
        />
      )}
      <RemoveMemberDialog
        member={removing}
        pending={removeMutation.isPending}
        error={removeMutation.isError}
        onConfirm={confirmRemove}
        onOpenChange={(open) => {
          if (!open) closeRemove();
        }}
      />
      {canImport && <ImportRosterDialog open={importOpen} onOpenChange={setImportOpen} />}
    </div>
  );
}

function RosterSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-app bg-surface p-4 shadow-sm" role="status">
      <span className="sr-only">{t('common.loading')}</span>
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
