import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../redux/authSlice';
import { showErrorMessage } from '../../components/toast/Toast';
import { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordValidator from './components/PasswordValidator';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const handleResetPassword = (data) => {
    setLoading(true);
    if (data.password === data.confirmPassword) {
      const submitData = {
        password: data.password,
        token,
      };
      dispatch(resetPassword(submitData))
        .unwrap()
        .then(() => {
          setIsSubmitted(true);
          setLoading(false);
        })
        .catch((err) => {
          showErrorMessage(
            err?.response?.data?.message || 'Password Reset Failed'
          );
          setLoading(false);
        });
    } else {
      showErrorMessage("Passwords don't match");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <Toaster />
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8'>
          <h2 className='text-3xl font-semibold text-center mb-6'>
            Reset Password
          </h2>
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit(handleResetPassword)}
              className='space-y-4'
            >
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  New Password
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    className='w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md'
                    placeholder='••••••••'
                    required
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
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm New Password
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id='confirmPassword'
                    name='confirmPassword'
                    className=' w-full pl-10 sm:text-sm border-gray-300 rounded-md '
                    placeholder='••••••••'
                    required
                    {...register('confirmPassword')}
                  />
                </div>
                <PasswordValidator
                  password={password}
                  setIsPasswordValid={setIsPasswordValid}
                />
              </div>
              <Button
                type='submit'
                disabled={!password || !isPasswordValid || loading}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                {loading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          ) : (
            <div className='text-center'>
              <Lock className='h-16 w-16 text-green-600 mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-2'>
                Password Reset Successful
              </h3>
              <p className='text-gray-600 mb-4'>
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <Button
                onClick={() => navigate(ROUTES.login)}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                Go to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
