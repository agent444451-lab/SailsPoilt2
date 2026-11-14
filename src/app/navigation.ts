import {
  Bell,
  BarChart3,
  Building2,
  ClipboardCheck,
  Contact,
  FileUp,
  GitBranch,
  KeyRound,
  LayoutDashboard,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  Target,
  UserCircle,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { Action } from '@/domain/permissions';

export interface NavItem {
  key: string;
  path: string;
  action: Action;
  icon: LucideIcon;
  /** Shown in the mobile bottom bar; the rest live under "More". */
  mobilePrimary?: boolean;
}

export interface NavSection {
  key: string;
  items: readonly NavItem[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'dashboard', path: '/', action: 'dashboard.view', icon: LayoutDashboard, mobilePrimary: true },
  { key: 'companies', path: '/companies', action: 'platform.manage_companies', icon: Building2 },
  { key: 'branches', path: '/branches', action: 'branch.manage', icon: GitBranch },
  { key: 'ranks', path: '/ranks', action: 'roles.manage', icon: Shield },
  { key: 'employees', path: '/employees', action: 'employee.view', icon: Users, mobilePrimary: true },
  { key: 'teams', path: '/teams', action: 'team.view', icon: UsersRound },
  { key: 'sales', path: '/sales', action: 'sale.view', icon: Receipt, mobilePrimary: true },
  { key: 'salesImport', path: '/sales/import', action: 'sale.import', icon: FileUp },
  { key: 'reports', path: '/reports', action: 'report.view', icon: BarChart3 },
  { key: 'targets', path: '/targets', action: 'target.view', icon: Target },
  { key: 'approvals', path: '/approvals', action: 'sale.approve', icon: ClipboardCheck },
  { key: 'passwordRequests', path: '/password-requests', action: 'password.approve', icon: KeyRound },
  { key: 'customers', path: '/customers', action: 'customer.manage', icon: Contact },
  { key: 'notifications', path: '/notifications', action: 'notification.view', icon: Bell },
  { key: 'auditLog', path: '/audit-log', action: 'audit.view', icon: ScrollText },
  { key: 'settings', path: '/settings', action: 'settings.view', icon: Settings },
  { key: 'profile', path: '/profile', action: 'account.manage', icon: UserCircle },
];

/**
 * Section grouping for the sidebar. Items not matching any section
 * appear under the first section. The `platform` section is only
 * shown to Super Admin / Owner roles (filtered by permission).
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  {
    key: 'main',
    items: NAV_ITEMS.filter((item) => item.key === 'dashboard'),
  },
  {
    key: 'organization',
    items: NAV_ITEMS.filter((item) =>
      ['companies', 'branches', 'ranks', 'employees', 'teams'].includes(item.key)
    ),
  },
  {
    key: 'sales',
    items: NAV_ITEMS.filter((item) =>
      ['sales', 'salesImport', 'reports', 'targets', 'approvals'].includes(item.key)
    ),
  },
  {
    key: 'admin',
    items: NAV_ITEMS.filter((item) =>
      ['passwordRequests', 'customers', 'notifications', 'auditLog'].includes(item.key)
    ),
  },
  {
    key: 'account',
    items: NAV_ITEMS.filter((item) => ['settings', 'profile'].includes(item.key)),
  },
];
