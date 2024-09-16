import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, DollarSign, Loader2 } from 'lucide-react';
import { ROUTES } from '../../utils/routes';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login } from '../../redux/authSlice';
import {
  showErrorMessage,
  showToastMessage,
} from '../../components/toast/Toast';
import { Toaster } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const handleLogin = (data) => {
    setLoading(true);
    const submitData = {
      first_name: data.firstName,
      email: data.email,
      password: data.password,
    };
    dispatch(login(submitData))
      .unwrap()
      .then(() => {
        setLoading(false);
        showToastMessage('Login Successful');
        navigate(ROUTES.dashboard);
      })
      .catch((err) => {
        showErrorMessage(err?.response?.data?.message || 'Login Failed');
        setLoading(false);
      });
  };
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_APP_BASE_URL}auth/google`;
  };

  const password = watch('password');
  const email = watch('email');
  return (
    <>
      <Toaster />
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg w-full max-w-4xl flex overflow-hidden'>
          {/* Left side - Image or Branding */}
          <div className='hidden md:block w-1/2 bg-green-600 p-12 text-white'>
            <div className='flex items-center mb-8'>
              <DollarSign className='h-12 w-12' />
              <h1 className='text-3xl font-bold ml-2'>ExpenseTracker</h1>
            </div>
            <p className='text-xl mb-4'>Take control of your finances</p>
            <p>
              Track expenses, set budgets, and achieve your financial goals with
              ease.
            </p>
          </div>

          {/* Right side - Auth Form */}
          <div className='w-full md:w-1/2 p-8'>
            <h2 className='text-3xl font-semibold text-center mb-6'>
              Welcome Back
            </h2>
            <form className='space-y-4' onSubmit={handleSubmit(handleLogin)}>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email Address
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-1'
                    placeholder='you@example.com'
                    {...register('email')}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    id='password'
                    className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-1'
                    placeholder='••••••••'
                    {...register('password')}
                  />
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                    <button
                      type='button'
                      onClick={togglePasswordVisibility}
                      className='focus:outline-none'
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400' />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <button
                  disabled={email && password ? false : true}
                  type='submit'
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>
            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>
                    Or continue with
                  </span>
                </div>
              </div>
              <div className='mt-6'>
                <button
                  onClick={handleGoogleAuth}
                  type='button'
                  className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                >
                  <svg
                    className='h-5 w-5 mr-2'
                    viewBox='0 0 21 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z'
                      fill='#3F83F8'
                    />
                    <path
                      d='M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z'
                      fill='#34A853'
                    />
                    <path
                      d='M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z'
                      fill='#FBBC04'
                    />
                    <path
                      d='M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z'
                      fill='#EA4335'
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
            <div className='mt-6 text-center text-sm'>
              <span className='text-gray-600'>Don&apos;t have an account?</span>
              <button
                disabled={loading}
                onClick={() => navigate(ROUTES.signup)}
                className='ml-1 font-medium text-green-600 hover:text-green-500'
              >
                Sign up{' '}
              </button>
            </div>

            <div className='mt-2 text-center text-sm'>
              <a
                href={ROUTES.forgot_password}
                className='font-medium text-green-600 hover:text-green-500'
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
