import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

function getPageRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 'ellipsis', total];
  if (current >= total - 2) return [1, 'ellipsis', total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const { t, i18n } = useTranslation();
  if (totalPages <= 1) return null;
  const isRtl = i18n.dir() === 'rtl';
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const pages = getPageRange(page, totalPages);

  const btnBase =
    'flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1';

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={t('common.back')}
        className={cn(
          btnBase,
          'px-2 text-neutral-600 hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40'
        )}
      >
        <PrevIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {pages.map((entry, idx) =>
        entry === 'ellipsis' ? (
          <span key={`e-${idx}`} className="flex h-9 w-9 items-center justify-center text-neutral-400">
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              btnBase,
              entry === page
                ? 'bg-primary-900 text-white shadow-sm'
                : 'text-neutral-700 hover:bg-neutral-100'
            )}
          >
            {entry}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.more')}
        className={cn(
          btnBase,
          'px-2 text-neutral-600 hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40'
        )}
      >
        <NextIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
