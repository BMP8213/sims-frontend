import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: '', password: '', remember: true },
  });
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      await login({ username: data.username, password: data.password }, data.remember);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <h2 className="mb-3 text-3xl font-semibold text-slate-900">Welcome Back</h2>
        <p className="mb-8 text-slate-500">Login to access the student information management dashboard.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              {...register('username', { required: true })}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              placeholder="admin"
            />
            {errors.username && <span className="mt-1 text-sm text-red-500">Username is required.</span>}
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              {...register('password', { required: true })}
              type="password"
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              placeholder="••••••••"
            />
            {errors.password && <span className="mt-1 text-sm text-red-500">Password is required.</span>}
          </label>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" {...register('remember')} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              Remember me
            </label>
            {/* <span>Use admin/admin123, teacher/teach123, cashier/cash123</span> */}
          </div>
          {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
