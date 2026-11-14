import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function NoPermissionState() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      className="flex animate-fade-in flex-col items-center justify-center gap-3 px-6 py-20 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-50 text-warning-700">
        <ShieldAlert className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold text-primary-900">
        {t('states.noPermissionTitle')}
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-app-secondary">
        {t('states.noPermissionBody')}
      </p>
    </div>
  );
}
