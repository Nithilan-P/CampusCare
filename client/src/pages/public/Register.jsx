import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().trim().min(1, 'Department is required'),
  rollNumber: z.string().trim().min(1, 'Roll number is required'),
  year: z.string().trim().min(1, 'Year is required'),
  phone: z.string().trim().optional(),
});

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await registerUser(formData);
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-soft">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          CampusCare
        </p>
        <h1 className="mb-6 text-2xl font-semibold text-text-primary">Student registration</h1>

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
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
            )}
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
              {errors.department && (
                <p className="mt-1 text-sm text-danger">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="year" className="mb-1 block text-sm font-medium text-text-primary">
                Year
              </label>
              <input
                id="year"
                type="text"
                placeholder="e.g. 2nd"
                {...register('year')}
                className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.year && <p className="mt-1 text-sm text-danger">{errors.year.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="rollNumber" className="mb-1 block text-sm font-medium text-text-primary">
              Roll number
            </label>
            <input
              id="rollNumber"
              type="text"
              {...register('rollNumber')}
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.rollNumber && (
              <p className="mt-1 text-sm text-danger">{errors.rollNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-text-primary">
              Phone <span className="text-text-secondary">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="w-full rounded-lg border border-border px-3 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary py-2 font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;