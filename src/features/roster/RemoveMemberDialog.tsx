import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import type { RosterMember } from '@/features/roster/rosterApi';

export function RemoveMemberDialog({
  member,
  pending,
  error,
  onConfirm,
  onOpenChange,
}: {
  member: RosterMember | null;
  pending: boolean;
  error: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <ConfirmDialog
      open={member !== null}
      onOpenChange={onOpenChange}
      title={t('roster.remove.title', { name: member?.fullNameEn ?? '' })}
      description={t('roster.remove.description')}
      confirmLabel={t('roster.remove.confirm')}
      pending={pending}
      error={error}
      errorLabel={t('roster.remove.failed')}
      onConfirm={onConfirm}
    />
  );
}
