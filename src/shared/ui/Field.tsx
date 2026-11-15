import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export const inputClass =
  'block w-full min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-primary-900 placeholder:text-neutral-400 transition-all duration-150 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 disabled:bg-neutral-100 disabled:text-neutral-500 sm:min-h-10';

export const inputErrorClass =
  'block w-full min-h-11 rounded-lg border border-error-400 bg-error-50/40 px-3 text-sm text-primary-900 placeholder:text-neutral-400 transition-all duration-150 focus:border-error-500 focus:outline-none focus:ring-2 focus:ring-error-500/20 disabled:bg-neutral-100 disabled:text-neutral-500 sm:min-h-10';

export function Field({
  id,
  label,
  error,
  hint,
  children,
  className,
  required,
  valid,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  valid?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-primary-900">
        {label}
        {required && <span className="text-error-600">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-error-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : valid ? (
        <p className="flex items-center gap-1.5 text-xs text-success-700">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {hint}
        </p>
      ) : hint ? (
        <p className="text-xs text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}
