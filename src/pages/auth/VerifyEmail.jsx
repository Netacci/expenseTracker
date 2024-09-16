import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { useDispatch } from 'react-redux';
import { confirmEmail, resendVerificationEmail } from '../../redux/authSlice';
import { Toaster } from 'react-hot-toast';
import {
  showErrorMessage,
  showToastMessage,
} from '../../components/toast/Toast';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, email } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(confirmEmail(token))
      .unwrap()
      .then(() => {
        setVerificationStatus('success');
      })
      .catch(() => {
        setVerificationStatus('error');
      });
  }, [dispatch, token]);
  const handleVerificationResend = () => {
    setLoading(true);
    dispatch(resendVerificationEmail(email))
      .unwrap()
      .then(() => {
        setVerificationStatus('sent');
        setLoading(false);
        showToastMessage('Verification email sent');
      })
      .catch(() => {
        setVerificationStatus('error');
        setLoading(false);
        showErrorMessage('Failed to resend verification email');
      });
  };

  return (
    <>
      <Toaster />
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8 text-center'>
          {verificationStatus === 'pending' && (
            <>
              <Loader2 className='h-16 w-16 text-green-600 mx-auto mb-4 animate-spin' />
              <h2 className='text-3xl font-semibold mb-4'>
                Verifying Your Email
              </h2>
              <p className='text-gray-600'>
                Please wait while we verify your email address...
              </p>
            </>
          )}
          {verificationStatus === 'success' && (
            <>
              <CheckCircle className='h-16 w-16 text-green-600 mx-auto mb-4' />
              <h2 className='text-3xl font-semibold mb-4'>Email Verified!</h2>
              <p className='text-gray-600 mb-6'>
                Your email has been successfully verified. You can now log in to
                your account.
              </p>
              <button
                onClick={() => navigate(ROUTES.login)}
                className='w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                Go to Login
              </button>
            </>
          )}
          {verificationStatus === 'sent' && (
            <>
              <CheckCircle className='h-16 w-16 text-green-600 mx-auto mb-4' />
              <h2 className='text-3xl font-semibold mb-4'>Verification Sent</h2>
              <p className='text-gray-600 mb-6'>
                We have sent a verification email to {email}. Please check your
                inbox and click the link to verify your email address.
              </p>
            </>
          )}
          {verificationStatus === 'error' && (
            <>
              <XCircle className='h-16 w-16 text-red-600 mx-auto mb-4' />
              <h2 className='text-3xl font-semibold mb-4'>
                Verification Failed
              </h2>
              <p className='text-gray-600 mb-6'>
                We couldn&apos;t verify your email. The link may have expired or
                is invalid.
              </p>
              <button
                onClick={handleVerificationResend}
                disabled={loading}
                className='w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
