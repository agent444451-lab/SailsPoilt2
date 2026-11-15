import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import { Field, inputClass, inputErrorClass } from '@/shared/ui/Field';
import { Alert } from '@/shared/ui/Alert';
import { firebaseErrorCode } from '@/shared/auth/firebase';
import { useAuth } from '@/features/auth/useAuth';
import { checkPasswordRequestByEmail, createPasswordRequestByEmail, generateResetKey, sha256Hex, storeResetKey } from '@/features/roster/rosterApi';
import { getBrowserFingerprint } from '@/shared/utils/browserFingerprint';

const schema = z.object({
  email: z.string().trim().email(),
});

type ForgotPasswordValues = z.infer<typeof schema>;

type ResetStatus = 'idle' | 'sent' | 'requested' | 'pending' | 'network' | 'unknown';

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { sendPasswordReset } = useAuth();
  const [status, setStatus] = useState<ResetStatus>('idle');
  const [checking, setChecking] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const requestApproval = async () => {
    const emailInput = document.getElementById('reset-email') as HTMLInputElement | null;
    if (!emailInput?.value) return;
    const email = emailInput.value.trim().toLowerCase();
    const fp = getBrowserFingerprint();
    setStatus('idle');
    setChecking(true);
    try {
      const { pending } = await checkPasswordRequestByEmail(email, fp);
      if (pending) {
        setStatus('pending');
        return;
      }
      const resetKey = generateResetKey();
      const resetKeyHash = await sha256Hex(resetKey);
      storeResetKey(resetKey);
      await createPasswordRequestByEmail(email, fp, resetKeyHash);
      setStatus('requested');
    } catch {
      setStatus('unknown');
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (values: ForgotPasswordValues) => {
    setStatus('idle');
    try {
      await sendPasswordReset(values.email);
      setStatus('sent');
    } catch (error) {
      const code = firebaseErrorCode(error);
      if (code === 'auth/user-not-found') setStatus('sent');
      else if (code === 'auth/network-request-failed') setStatus('network');
      else setStatus('unknown');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Field
          id="reset-email"
          label={t('auth.signIn.email')}
          error={errors.email && t('auth.errors.emailInvalid')}
          required
        >
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            className={errors.email ? inputErrorClass : inputClass}
            {...register('email')}
          />
        </Field>
        {status === 'sent' && (
          <Alert tone="success">{t('auth.forgot.sent')}</Alert>
        )}
        {status === 'requested' && (
          <Alert tone="success">{t('auth.forgot.requested')}</Alert>
        )}
        {status === 'pending' && (
          <Alert tone="warning">{t('auth.forgot.pending')}</Alert>
        )}
        {(status === 'network' || status === 'unknown') && (
          <Alert tone="error" onClose={() => setStatus('idle')}>
            {t(`auth.errors.${status}`)}
          </Alert>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit" disabled={isSubmitting || checking} className="w-full">
            {isSubmitting ? t('auth.forgot.submitting') : t('auth.forgot.submit')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => void requestApproval()} disabled={isSubmitting || checking} className="w-full">
            {checking ? t('common.loading') : t('auth.forgot.requestApproval')}
          </Button>
        </div>
      </form>
      <Button variant="ghost" onClick={onBack} className="w-full">
        {t('auth.forgot.back')}
      </Button>
    </div>
  );
}
