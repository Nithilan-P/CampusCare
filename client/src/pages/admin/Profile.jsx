import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../api/auth';
import PasswordInput from '../../components/PasswordInput';

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  department: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function ProfileForm() {
  const { user, updateLocalUser } = useAuth();
  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (formData) => {
    setServerError('');
    setServerMessage('');
    try {
      const res = await updateProfile(formData);
      setServerMessage(res.data.message);
      updateLocalUser(res.data.data);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">Profile Details</h2>

      {serverMessage && (
        <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
          {serverMessage}
        </div>
      )}
      {serverError && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-text-primary">
            Full name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-secondary"
          />
          <p className="mt-1 text-xs text-text-secondary">Email cannot be changed</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className="mb-1 block text-sm font-medium text-text-primary">
              Department
            </label>
            <input
              id="department"
              type="text"
              {...register('department')}
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-text-primary">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function PasswordForm() {
  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (formData) => {
    setServerError('');
    setServerMessage('');
    try {
      const res = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setServerMessage(res.data.message);
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">Change Password</h2>

      {serverMessage && (
        <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
          {serverMessage}
        </div>
      )}
      {serverError && (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="oldPassword" className="mb-1 block text-sm font-medium text-text-primary">
            Current password
          </label>
          <PasswordInput id="oldPassword" {...register('oldPassword')} />
          {errors.oldPassword && (
            <p className="mt-1 text-sm text-danger">{errors.oldPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-text-primary">
            New password
          </label>
          <PasswordInput id="newPassword" {...register('newPassword')} />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-danger">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-text-primary">
            Confirm new password
          </label>
          <PasswordInput id="confirmPassword" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

function Profile() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Profile</h1>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}

export default Profile;