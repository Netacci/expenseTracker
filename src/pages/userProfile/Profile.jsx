/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '../../components/navbar/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { editAccount, fetchUserDetails } from '../../redux/userSlice';
import { useForm } from 'react-hook-form';
import { showErrorMessage, showToastMessage } from '../../components/toast/Toast';
import { Toaster } from 'react-hot-toast';
import { User, Mail, Loader2, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: { name: user?.first_name, email: user?.email },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user?.first_name);
      setValue('email', user?.email);
    }
  }, [user, setValue]);

  const handleEditProfile = (data) => {
    setLoading(true);
    dispatch(editAccount({ first_name: data.name }))
      .unwrap()
      .then(() => {
        setLoading(false);
        showToastMessage('Profile updated successfully');
      })
      .catch((err) => {
        setLoading(false);
        showErrorMessage(err?.response?.data?.message || 'Profile update failed');
      });
  };

  return (
    <Layout>
      <Toaster />
      <div className='max-w-2xl'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-slate-900'>Edit Profile</h2>
          <p className='text-slate-500 text-sm mt-1'>Update your personal information</p>
        </div>

        <div className='bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden'>
          {/* Profile avatar section */}
          <div className='bg-gradient-to-br from-slate-900 to-emerald-950 px-6 py-8 flex items-center gap-5'>
            <div className='w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg'>
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className='text-white font-bold text-lg'>{user?.first_name || 'User'}</h3>
              <p className='text-slate-400 text-sm'>{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleEditProfile)} className='p-6 space-y-5'>
            <div>
              <Label htmlFor='name' className='text-sm font-medium text-slate-700 mb-1.5 block'>
                Display Name
              </Label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                <Input
                  id='name'
                  name='name'
                  type='text'
                  required
                  className='pl-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-transparent'
                  {...register('name')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor='email' className='text-sm font-medium text-slate-700 mb-1.5 block'>
                Email Address
                <span className='ml-2 text-xs text-slate-400 font-normal'>(cannot be changed)</span>
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300' />
                <Input
                  disabled
                  id='email'
                  type='email'
                  name='email'
                  required
                  className='pl-10 bg-slate-50 border-slate-200 rounded-xl text-slate-400 cursor-not-allowed'
                  {...register('email')}
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md'
            >
              {loading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle className='h-4 w-4' />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
