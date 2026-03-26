import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/authSlice';
import { showErrorMessage, showToastMessage } from '../../components/toast/Toast';
import { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit, register, watch } = useForm({ defaultValues: { email: '' } });
  const email = watch('email');

  const handleForgotPassword = (data) => {
    setLoading(true);
    dispatch(forgotPassword({ email: data.email }))
      .unwrap()
      .then(() => {
        setLoading(false);
        setIsSubmitted(true);
        showToastMessage('Password reset link sent to your email');
      })
      .catch((err) => {
        setLoading(false);
        showErrorMessage(err?.response?.data?.message || 'Something went wrong. Try again!');
      });
  };

  return (
    <>
      <Toaster />
      <div className='min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md'>
          <div className='flex justify-center mb-8'>
            <div className='flex items-center gap-2.5'>
              <div className='w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center'>
                <DollarSign className='h-5 w-5 text-white' />
              </div>
              <span className='text-slate-900 font-bold text-xl'>ExpenseTracker</span>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-card border border-slate-100 p-8'>
            <button
              onClick={() => navigate(ROUTES.login)}
              className='flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 -ml-1'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to login
            </button>

            {!isSubmitted ? (
              <>
                <div className='mb-7'>
                  <div className='w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4'>
                    <Mail className='h-6 w-6 text-emerald-600' />
                  </div>
                  <h1 className='text-2xl font-bold text-slate-900 mb-2'>Forgot your password?</h1>
                  <p className='text-slate-500 text-sm leading-relaxed'>
                    No worries — enter your email and we&apos;ll send you a reset link right away.
                  </p>
                </div>

                <form onSubmit={handleSubmit(handleForgotPassword)} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1.5'>Email address</label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                      <input
                        type='email'
                        className='w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                        placeholder='you@example.com'
                        required
                        {...register('email')}
                      />
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={loading || !email}
                    className='group w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none'
                  >
                    {loading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className='h-4 w-4 group-hover:translate-x-0.5 transition-transform' />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className='text-center py-4'>
                <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5'>
                  <CheckCircle className='h-8 w-8 text-emerald-600' />
                </div>
                <h2 className='text-xl font-bold text-slate-900 mb-3'>Check your inbox</h2>
                <p className='text-slate-500 text-sm leading-relaxed mb-6'>
                  If an account exists for <strong className='text-slate-700'>{email}</strong>, we&apos;ve sent a password reset link to that address.
                </p>
                <button
                  onClick={() => navigate(ROUTES.login)}
                  className='text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors'
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
