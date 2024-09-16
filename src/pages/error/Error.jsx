/* eslint-disable react/prop-types */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

const Error = ({ error = 'An unexpected error occurred.' }) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='max-w-md w-full space-y-8'>
        <Alert variant='destructive' className='border-red-500'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle className='text-lg font-semibold'>Error</AlertTitle>
          <AlertDescription className='mt-2'>{error}</AlertDescription>
        </Alert>
        <div className='text-center'>
          <p className='mt-2 text-sm text-gray-600'>
            We apologize for the inconvenience. Please try again later or return
            to the home page.
          </p>
          <Button
            className='mt-4 bg-green-600'
            onClick={() => (window.location.href = '/login')}
          >
            <Home className='mr-2 h-4 w-4 text-white' />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
