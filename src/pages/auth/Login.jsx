import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, DollarSign, Loader2, ArrowRight, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../utils/routes';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login } from '../../redux/authSlice';
import { showErrorMessage, showToastMessage } from '../../components/toast/Toast';
import { Toaster } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, register, watch } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await dispatch(login({ email: data.email, password: data.password })).unwrap();
      showToastMessage('Login Successful');
      navigate(ROUTES.dashboard);
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || err?.response?.data || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => navigate(ROUTES.google_redirect);
  const password = watch('password');
  const email = watch('email');

  return (
    <>
      <Toaster />
      <div className='min-h-screen flex'>
        {/* Left Panel */}
        <div className='hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex-col justify-between p-10 relative overflow-hidden'>
          <div className='absolute inset-0 hero-pattern opacity-20' />
          <div className='absolute top-1/3 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl' />
          <div className='absolute bottom-1/3 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl' />

          <div className='relative flex items-center gap-2.5'>
            <div className='w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center'>
              <DollarSign className='h-5 w-5 text-white' />
            </div>
            <span className='text-white font-bold text-xl'>ExpenseTracker</span>
          </div>

          <div className='relative'>
            <h2 className='text-4xl font-bold text-white leading-tight mb-4'>
              Take control of your
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300'>
                financial future
              </span>
            </h2>
            <p className='text-slate-400 leading-relaxed mb-8'>
              Track expenses, manage budgets, and build wealth with clarity and confidence.
            </p>

            <div className='space-y-3'>
              {[
                { icon: BarChart2, label: 'Real-time budget tracking' },
                { icon: PieChart, label: 'Visual spending insights' },
                { icon: TrendingUp, label: 'Smart financial analytics' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <Icon className='h-4 w-4 text-emerald-400' />
                  </div>
                  <span className='text-slate-300 text-sm font-medium'>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className='relative text-slate-500 text-sm'>
            Trusted by 50,000+ users worldwide
          </p>
        </div>

        {/* Right Panel */}
        <div className='flex-1 flex items-center justify-center bg-slate-50 px-6 py-12'>
          <div className='w-full max-w-md'>
            {/* Mobile logo */}
            <div className='lg:hidden flex items-center justify-center gap-2.5 mb-8'>
              <div className='w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center'>
                <DollarSign className='h-5 w-5 text-white' />
              </div>
              <span className='text-slate-900 font-bold text-xl'>ExpenseTracker</span>
            </div>

            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-slate-900 mb-2'>Welcome back</h1>
              <p className='text-slate-500'>Sign in to your account to continue</p>
            </div>

            <div className='bg-white rounded-2xl shadow-card border border-slate-100 p-6 md:p-8'>
              <form className='space-y-4' onSubmit={handleSubmit(handleLogin)}>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1.5'>Email address</label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                    <input
                      type='email'
                      className='w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                      placeholder='you@example.com'
                      {...register('email')}
                    />
                  </div>
                </div>

                <div>
                  <div className='flex justify-between items-center mb-1.5'>
                    <label className='block text-sm font-medium text-slate-700'>Password</label>
                    <Link to={ROUTES.forgot_password} className='text-xs font-medium text-emerald-600 hover:text-emerald-700'>
                      Forgot password?
                    </Link>
                  </div>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className='w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                      placeholder='••••••••'
                      {...register('password')}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                    >
                      {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                    </button>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={!email || !password || loading}
                  className='group w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none mt-2'
                >
                  {loading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className='h-4 w-4 group-hover:translate-x-0.5 transition-transform' />
                    </>
                  )}
                </button>
              </form>

              <div className='relative my-5'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-slate-100' />
                </div>
                <div className='relative flex justify-center'>
                  <span className='bg-white px-3 text-xs text-slate-400 font-medium'>or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleAuth}
                type='button'
                className='w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm'
              >
                <svg className='h-4 w-4' viewBox='0 0 21 20' fill='none'>
                  <path d='M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z' fill='#3F83F8' />
                  <path d='M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006Z' fill='#34A853' />
                  <path d='M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169Z' fill='#FBBC04' />
                  <path d='M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805Z' fill='#EA4335' />
                </svg>
                Sign in with Google
              </button>
            </div>

            <p className='text-center text-sm text-slate-500 mt-6'>
              Don&apos;t have an account?{' '}
              <button
                disabled={loading}
                onClick={() => navigate(ROUTES.signup)}
                className='font-semibold text-emerald-600 hover:text-emerald-700 transition-colors'
              >
                Create one free
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
