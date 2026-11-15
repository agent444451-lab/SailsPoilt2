import type { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  icon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const sizeClass =
    size === 'lg'
      ? 'sm:w-[min(48rem,calc(100vw-3rem))]'
      : size === 'sm'
        ? 'sm:w-[min(26rem,calc(100vw-3rem))]'
        : 'sm:w-[min(32rem,calc(100vw-3rem))]';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-primary-900/40 backdrop-blur-[3px] animate-fade-in" />
        <Dialog.Content
          dir={i18n.dir()}
          className={cn(
            'fixed inset-x-4 top-1/2 z-50 max-h-[90dvh] -translate-y-1/2 overflow-y-auto rounded-2xl bg-surface shadow-xl animate-scale-in focus:outline-none',
            'sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2',
            'rtl:sm:left-auto rtl:sm:right-1/2 rtl:sm:translate-x-1/2 rtl:sm:-translate-x-1/2',
            sizeClass
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-app-soft p-5 sm:p-6">
            <div className="flex min-w-0 items-start gap-3">
              {icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  {icon}
                </span>
              )}
              <div className="min-w-0">
                <Dialog.Title className="text-lg font-semibold text-primary-900">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-sm leading-relaxed text-app-secondary">
                    {description}
                  </Dialog.Description>
                )}
              </div>
            </div>
            <Dialog.Close
              aria-label={t('common.close')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-all hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="p-5 sm:p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
