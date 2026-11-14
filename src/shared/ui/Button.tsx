import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'sm' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-900 text-white shadow-sm hover:bg-primary-800 hover:shadow active:scale-[0.98] focus-visible:ring-accent-500',
  secondary:
    'bg-surface text-primary-900 border border-app shadow-xs hover:bg-neutral-50 hover:border-neutral-400 active:scale-[0.98] focus-visible:ring-accent-500',
  ghost:
    'bg-transparent text-primary-900 hover:bg-neutral-100 active:scale-[0.98] focus-visible:ring-accent-500',
  danger:
    'bg-error-600 text-white shadow-sm hover:bg-error-700 hover:shadow active:scale-[0.98] focus-visible:ring-error-500',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  lg: 'min-h-12 px-5 text-sm sm:min-h-11',
  md: 'min-h-11 px-4 text-sm sm:min-h-10',
  sm: 'min-h-9 px-3 text-xs',
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>(function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-150 ease-out-expo',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
});
