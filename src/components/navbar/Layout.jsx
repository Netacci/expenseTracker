/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import AppShell from '../layout/AppShell';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../../redux/userSlice';

const Layout = ({ children, dashboard }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <AppShell>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-8'>
        {user && dashboard && (
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-slate-900'>
              Good {getGreeting()}, <span className='text-emerald-600'>{user?.first_name}</span> 👋
            </h1>
            <p className='text-slate-500 text-sm mt-1'>Here&apos;s your financial overview</p>
          </div>
        )}
        {children}
      </main>
    </AppShell>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default Layout;
