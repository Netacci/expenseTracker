/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import Navbar from './Navbar';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../../redux/userSlice';

const Layout = ({ children, dashboard }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />
      <main className='container mx-auto mt-4 p-4'>
        {user && dashboard ? (
          <h1 className='text-2xl font-bold mb-4'>
            Welcome, {user?.first_name}!
          </h1>
        ) : null}

        {children}
      </main>
    </div>
  );
};

export default Layout;
