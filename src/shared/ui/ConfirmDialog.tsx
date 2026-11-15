import type { ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending,
  error,
  errorLabel,
  onConfirm,
  variant = 'danger',
  icon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  pending?: boolean;
  error?: boolean;
  errorLabel?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'primary';
  icon?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description} size="md">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4 rounded-xl bg-error-50/60 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error-100 text-error-700">
            {icon ?? <TriangleAlert className="h-5 w-5" aria-hidden="true" />}
          </span>
          <p className="text-sm leading-relaxed text-error-800">{description}</p>
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-error-50 px-3 py-2 text-sm text-error-700">
            {errorLabel}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            {cancelLabel ?? t('common.cancel')}
          </Button>
          <Button
            variant={variant}
            disabled={pending}
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {pending ? t('common.loading') : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
