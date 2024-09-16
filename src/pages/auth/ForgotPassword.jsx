import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/authSlice';
import {
  showErrorMessage,
  showToastMessage,
} from '../../components/toast/Toast';
import { Toaster } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const email = watch('email');
  const handleForgotPassword = (data) => {
    setLoading(true);
    const submitData = {
      email: data.email,
    };
    dispatch(forgotPassword(submitData))
      .unwrap()
      .then(() => {
        setLoading(false);
        setIsSubmitted(true);
        showToastMessage('Password reset link has been sent to your email');
      })
      .catch((err) => {
        setLoading(false);
        showErrorMessage(
          err?.response?.data?.message || 'Something went wrong. Try again!'
        );
      });
  };

  return (
    <>
      <Toaster />
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8'>
          <button
            onClick={() => navigate(ROUTES.login)}
            className='flex items-center text-green-600 hover:text-green-700 mb-6'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Login
          </button>
          <h2 className='text-3xl font-semibold text-center mb-6'>
            Forgot Password
          </h2>
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit(handleForgotPassword)}
              className='space-y-4'
            >
              <div>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400' />
                  </div>
                  <Input
                    type='email'
                    name='email'
                    id='email'
                    className='w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                    placeholder='you@example.com'
                    required
                    {...register('email')}
                  />
                </div>
              </div>
              <Button
                type='submit'
                disabled={loading || email === ''}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                {loading ? 'Sending...' : ' Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className='text-center'>
              <Mail className='h-16 w-16 text-green-600 mx-auto mb-4' />
              <p className='text-gray-600 mb-4'>
                If an account exists for {email}, we&apos;ve sent a password
                reset link to that email address.
              </p>
              <button
                onClick={() => navigate(ROUTES.login)}
                className='text-green-600 hover:text-green-700 font-medium'
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
