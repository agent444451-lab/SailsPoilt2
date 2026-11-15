import { useState } from 'react';
import { Building2, CheckCircle2, Plus, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/useAuth';
import { useRosterList, useCreateCompanyWithAdmin, useAddCompanyAssistant } from '@/features/roster/useRoster';
import { provisionSingleAccount } from '@/shared/auth/firebase';
import { firebaseErrorCode } from '@/shared/auth/firebase';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Field, inputClass } from '@/shared/ui/Field';
import { Alert } from '@/shared/ui/Alert';
import { Modal } from '@/shared/ui/Modal';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Skeleton } from '@/shared/ui/Skeleton';

export function CompaniesPage() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const member = state.status === 'ready' ? state.member : null;
  const rosterQuery = useRosterList(member?.id ?? '');
  const [addOpen, setAddOpen] = useState(false);
  const [assistantCompany, setAssistantCompany] = useState<{ id: string; name: string } | null>(null);

  if (!member || rosterQuery.isPending) return <Skeleton className="h-96 w-full" />;
  if (rosterQuery.isError) return <ErrorState onRetry={() => void rosterQuery.refetch()} />;

  const companies = rosterQuery.data?.lookups.companies ?? [];
  const members = rosterQuery.data?.members ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('companies.title')}
        description={t('companies.description')}
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('companies.add')}
          </Button>
        }
      />

      {companies.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Building2 className="h-7 w-7" aria-hidden="true" />}
            title={t('companies.emptyTitle')}
            body={t('companies.emptyBody')}
          />
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {companies.map((company) => {
            const companyAdmins = members.filter(
              (m) => m.companyId === company.id && m.role === 'COMPANY_ADMIN'
            );
            const companyMembers = members.filter((m) => m.companyId === company.id);
            return (
              <Card key={company.id} interactive className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 transition-transform hover:scale-110">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold text-primary-900">{company.name}</h2>
                    {company.trade_license && (
                      <p className="text-xs text-neutral-500" dir="ltr">
                        {t('companies.tradeLicense')}: {company.trade_license}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      {t('companies.membersCount', { count: companyMembers.length })}
                    </p>
                  </div>
                </div>
                {companyAdmins.length > 0 && (
                  <div className="mt-4 border-t border-app-soft pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        {t('companies.admins')}
                      </p>
                      {member && member.role === 'OWNER' && (
                        <Button variant="ghost" size="sm" onClick={() => setAssistantCompany({ id: company.id, name: company.name })}>
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          {t('companies.addAssistant')}
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {companyAdmins.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-neutral-50">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-success-600" aria-hidden="true" />
                            <span className="text-sm font-medium text-primary-900" dir="auto">
                              {admin.fullNameEn}
                            </span>
                          </div>
                          <Badge tone="success" dot>{t('roles.COMPANY_ADMIN')}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <AddCompanyDialog open={addOpen} onOpenChange={setAddOpen} />
      <AddAssistantDialog company={assistantCompany} onOpenChange={(open) => { if (!open) setAssistantCompany(null); }} />
    </div>
  );
}

function AddCompanyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  const mutation = useCreateCompanyWithAdmin();
  const [companyName, setCompanyName] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminNameAr, setAdminNameAr] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ email: string; userId: string } | null>(null);

  const reset = () => {
    setCompanyName('');
    setTradeLicense('');
    setAdminName('');
    setAdminNameAr('');
    setAdminEmail('');
    setAdminPassword('');
    setProvisionError(null);
    setSuccess(null);
    mutation.reset();
  };

  const handleClose = (next: boolean) => {
    if (!next && mutation.isPending) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const canSubmit =
    companyName.trim() &&
    adminName.trim() &&
    adminEmail.trim() &&
    adminPassword.length >= 8 &&
    !mutation.isPending;

  const submit = async () => {
    setProvisionError(null);
    setSuccess(null);
    try {
      const result = await mutation.mutateAsync({
        companyName: companyName.trim(),
        tradeLicense: tradeLicense.trim() || null,
        adminName: adminName.trim(),
        adminNameAr: adminNameAr.trim() || null,
        adminEmail: adminEmail.trim().toLowerCase(),
        adminPassword,
      });
      try {
        await provisionSingleAccount(adminEmail.trim().toLowerCase(), adminPassword);
      } catch (error) {
        setProvisionError(firebaseErrorCode(error) ?? 'provision_failed');
      }
      setSuccess({ email: result.admin.email, userId: result.admin.userId });
    } catch {
      // error is surfaced via mutation.isError
    }
  };

  if (success) {
    return (
      <Modal open={open} onOpenChange={handleClose} size="md" title={t('companies.addSuccessTitle')}>
        <div className="flex flex-col gap-4">
          <Alert tone="success">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t('companies.addSuccessBody', { company: companyName })}
            </div>
          </Alert>
          <div className="rounded-xl border border-app-soft bg-neutral-50/60 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">{t('companies.adminEmail')}</span>
                <span className="font-medium text-primary-900" dir="ltr">{success.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">{t('companies.adminUserId')}</span>
                <span className="font-mono font-medium text-primary-900" dir="ltr">{success.userId}</span>
              </div>
            </div>
            {provisionError && (
              <Alert tone="warning" className="mt-3">
                {t('companies.provisionWarning')}
              </Alert>
            )}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">{t('companies.firstLoginNote')}</p>
          <Button variant="secondary" onClick={() => handleClose(false)} className="w-full sm:w-auto sm:self-end">
            {t('common.close')}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      size="lg"
      title={t('companies.addTitle')}
      description={t('companies.addDescription')}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) void submit();
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="company-name" label={t('companies.fieldCompanyName')} required>
            <input id="company-name" className={inputClass} value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={mutation.isPending} autoFocus />
          </Field>
          <Field id="trade-license" label={t('companies.fieldTradeLicense')}>
            <input id="trade-license" className={inputClass} value={tradeLicense} onChange={(e) => setTradeLicense(e.target.value)} disabled={mutation.isPending} dir="ltr" />
          </Field>
        </div>

        <div className="border-t border-app-soft pt-5">
          <p className="mb-4 text-sm font-semibold text-primary-900">{t('companies.adminSection')}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="admin-name" label={t('companies.fieldAdminName')} required>
              <input id="admin-name" className={inputClass} value={adminName} onChange={(e) => setAdminName(e.target.value)} disabled={mutation.isPending} />
            </Field>
            <Field id="admin-name-ar" label={t('companies.fieldAdminNameAr')}>
              <input id="admin-name-ar" className={inputClass} value={adminNameAr} onChange={(e) => setAdminNameAr(e.target.value)} disabled={mutation.isPending} dir="auto" />
            </Field>
            <Field id="admin-email" label={t('companies.fieldAdminEmail')} required>
              <input id="admin-email" type="email" className={inputClass} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} disabled={mutation.isPending} dir="ltr" />
            </Field>
            <Field id="admin-password" label={t('companies.fieldAdminPassword')} hint={t('companies.passwordHint')} required>
              <input id="admin-password" type="password" className={inputClass} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} disabled={mutation.isPending} dir="ltr" autoComplete="new-password" />
            </Field>
          </div>
        </div>

        {mutation.isError && (
          <Alert tone="error">{t('companies.addFailed')}</Alert>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={() => handleClose(false)} disabled={mutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {mutation.isPending ? t('companies.creating') : t('companies.add')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function AddAssistantDialog({
  company,
  onOpenChange,
}: {
  company: { id: string; name: string } | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const mutation = useAddCompanyAssistant();
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ email: string; userId: string } | null>(null);

  const reset = () => {
    setName('');
    setNameAr('');
    setEmail('');
    setPassword('');
    setProvisionError(null);
    setSuccess(null);
    mutation.reset();
  };

  const handleClose = (next: boolean) => {
    if (!next && mutation.isPending) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const canSubmit = name.trim() && email.trim() && password.length >= 8 && !mutation.isPending;

  const submit = async () => {
    setProvisionError(null);
    setSuccess(null);
    if (!company) return;
    try {
      const result = await mutation.mutateAsync({
        companyId: company.id,
        name: name.trim(),
        nameAr: nameAr.trim() || null,
        email: email.trim().toLowerCase(),
        password,
      });
      try {
        await provisionSingleAccount(email.trim().toLowerCase(), password);
      } catch (error) {
        setProvisionError(firebaseErrorCode(error) ?? 'provision_failed');
      }
      setSuccess({ email: result.assistant.email, userId: result.assistant.userId });
    } catch {
      // surfaced via mutation.isError
    }
  };

  if (success) {
    return (
      <Modal open={company !== null} onOpenChange={handleClose} size="md" title={t('companies.assistantSuccess')}>
        <div className="flex flex-col gap-4">
          <Alert tone="success">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t('companies.assistantSuccess')}
            </div>
          </Alert>
          <div className="rounded-xl border border-app-soft bg-neutral-50/60 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">{t('companies.assistantEmail')}</span>
                <span className="font-medium text-primary-900" dir="ltr">{success.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">{t('companies.assistantUserId')}</span>
                <span className="font-mono font-medium text-primary-900" dir="ltr">{success.userId}</span>
              </div>
            </div>
            {provisionError && (
              <Alert tone="warning" className="mt-3">
                {t('companies.provisionWarning')}
              </Alert>
            )}
          </div>
          <Button variant="secondary" onClick={() => handleClose(false)} className="w-full sm:w-auto sm:self-end">
            {t('common.close')}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={company !== null}
      onOpenChange={handleClose}
      size="lg"
      title={t('companies.assistantTitle')}
      description={t('companies.assistantDescription')}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) void submit();
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="assistant-name" label={t('companies.assistantName')} required>
            <input id="assistant-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} disabled={mutation.isPending} autoFocus />
          </Field>
          <Field id="assistant-name-ar" label={t('companies.assistantNameAr')}>
            <input id="assistant-name-ar" className={inputClass} value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={mutation.isPending} dir="auto" />
          </Field>
          <Field id="assistant-email" label={t('companies.assistantEmail')} required>
            <input id="assistant-email" type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} disabled={mutation.isPending} dir="ltr" />
          </Field>
          <Field id="assistant-password" label={t('companies.assistantPassword')} hint={t('companies.passwordHint')} required>
            <input id="assistant-password" type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} disabled={mutation.isPending} dir="ltr" autoComplete="new-password" />
          </Field>
        </div>
        {mutation.isError && (
          <Alert tone="error">{t('companies.assistantFailed')}</Alert>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={() => handleClose(false)} disabled={mutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {mutation.isPending ? t('companies.assistantCreating') : t('companies.addAssistant')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
