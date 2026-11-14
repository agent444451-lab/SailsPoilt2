import { useMemo } from 'react';
import { NAV_ITEMS, NAV_SECTIONS, type NavItem, type NavSection } from '@/app/navigation';
import { useCurrentUser } from '@/data/queries';
import { can } from '@/domain/permissions';

export function useVisibleNavItems(): NavItem[] {
  const { data: user } = useCurrentUser();
  return useMemo(() => NAV_ITEMS.filter((item) => can(user, item.action)), [user]);
}

export function useVisibleNavSections(): NavSection[] {
  const { data: user } = useCurrentUser();
  return useMemo(
    () =>
      NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => can(user, item.action)),
      })).filter((section) => section.items.length > 0),
    [user]
  );
}
