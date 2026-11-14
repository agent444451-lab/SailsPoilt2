import { TriangleAlert as AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="flex animate-fade-in flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error-50 text-error-700">
        <AlertTriangle className="h-8 w-8" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-primary-900">{t('states.errorTitle')}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-app-secondary">
        {t('states.errorBody')}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-3">
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}
