import { useEffect } from 'react';

const GooglePage = () => {
  useEffect(() => {
    const googleRedirect = async () => {
      window.location.href = `${import.meta.env.VITE_APP_BASE_URL}auth/google`;
    };
    googleRedirect();
  }, []);
  return <div>Redirecting...</div>;
};

export default GooglePage;
