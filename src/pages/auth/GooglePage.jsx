import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const GooglePage = () => {
  useEffect(() => {
    const prefetchGoogleAuth = new Image();
    prefetchGoogleAuth.src = `${import.meta.env.VITE_APP_BASE_URL}auth/google`;
    const googleRedirect = async () => {
      window.location.href = `${import.meta.env.VITE_APP_BASE_URL}auth/google`;
    };
    googleRedirect();
  }, []);
  return (
    <div>
      <h2>Redirecting to Google Authentication...</h2>
      <div className='w-full h-full flex justify-center items-center'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    </div>
  );
};

export default GooglePage;
