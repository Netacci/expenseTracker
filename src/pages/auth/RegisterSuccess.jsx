import React from 'react';
import { CheckCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const RegistrationSuccessful = () => {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8 text-center'>
        <CheckCircle className='h-16 w-16 text-green-600 mx-auto mb-4' />
        <h2 className='text-3xl font-semibold mb-4'>
          Registration Successful!
        </h2>
        <p className='text-gray-600 mb-6'>
          Please check your email to verify your account. You&apos;ll need to
          verify your email before you can log in.
        </p>
        <button
          onClick={() => navigate(ROUTES.login)}
          className='w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          <LogIn className='h-5 w-5 mr-2' />
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessful;
