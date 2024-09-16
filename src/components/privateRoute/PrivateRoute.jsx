/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { authContext } from './../../context/AuthProvider';
import { useContext } from 'react';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(authContext);

  if (isAuthenticated === null) {
    return (
      <div className='flex justify-center items-center h-[100vh] w-full'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    ); // Show loading state while checking auth
  }
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} />;
  }

  return children;
};

export default PrivateRoute;
