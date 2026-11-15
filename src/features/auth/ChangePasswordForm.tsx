import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import { Field, inputClass, inputErrorClass } from '@/shared/ui/Field';
import { Alert } from '@/shared/ui/Alert';
import { useAuth } from '@/features/auth/useAuth';
import { RosterError } from '@/features/roster/rosterApi';

const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$/;

const schema = z
  .object({
    password: z.string().regex(PASSWORD_PATTERN),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, { path: ['confirm'] });

type ChangePasswordValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const { changePassword, signOut } = useAuth();
  const [failure, setFailure] = useState<'recentLogin' | 'serviceDown' | 'updateFailed' | 'unknown' | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    setFailure(null);
    try {
      await changePassword(values.password);
    } catch (error) {
      if (error instanceof RosterError) {
        if (error.code === 'firebase_not_configured') setFailure('serviceDown');
        else if (error.code === 'firebase_update_failed') setFailure('updateFailed');
        else setFailure('unknown');
      } else {
        setFailure('unknown');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Field
          id="new-password"
          label={t('auth.changePassword.newPassword')}
          hint={t('auth.changePassword.hint')}
          error={errors.password && t('auth.errors.passwordInvalid')}
          required
        >
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            className={errors.password ? inputErrorClass : inputClass}
            {...register('password')}
          />
        </Field>
        <Field
          id="confirm-password"
          label={t('auth.changePassword.confirmPassword')}
          error={errors.confirm && t('auth.errors.passwordMismatch')}
          required
        >
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            className={errors.confirm ? inputErrorClass : inputClass}
            {...register('confirm')}
          />
        </Field>
        {failure && (
          <Alert tone="error" onClose={() => setFailure(null)}>
            {failure === 'recentLogin' ? t('auth.errors.requiresRecentLogin') : failure === 'serviceDown' ? t('auth.errors.firebaseNotConfigured') : failure === 'updateFailed' ? t('auth.errors.firebaseUpdateFailed') : t('auth.errors.generic')}
          </Alert>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('auth.changePassword.submitting') : t('auth.changePassword.submit')}
        </Button>
      </form>
      <Button variant="ghost" onClick={() => void signOut()} className="w-full">
        {t('auth.signOut')}
      </Button>
    </div>
  );
}
