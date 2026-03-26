import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../../redux/userSlice';
import { useState } from 'react';
import { showErrorMessage, showToastMessage } from '../../../components/toast/Toast';
import PasswordValidator from '../../auth/components/PasswordValidator';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { handleSubmit, register, watch, reset } = useForm({
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const handleChangePassword = (data) => {
    setLoading(true);
    dispatch(changePassword({ oldPassword: data.currentPassword, newPassword: data.newPassword }))
      .unwrap()
      .then(() => {
        setLoading(false);
        showToastMessage('Password changed successfully');
        reset();
      })
      .catch((err) => {
        showErrorMessage(err?.response?.data?.message || 'Password change failed');
        setLoading(false);
      });
  };

  const password = watch('newPassword');
  const currentPassword = watch('currentPassword');

  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden'>
      <div className='flex items-center gap-3 px-6 py-4 border-b border-slate-50'>
        <div className='w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center'>
          <Lock className='h-4 w-4 text-blue-600' />
        </div>
        <div>
          <h3 className='font-bold text-slate-900 text-base'>Change Password</h3>
          <p className='text-xs text-slate-400'>Update your account password</p>
        </div>
      </div>
      <div className='p-6'>
        <form onSubmit={handleSubmit(handleChangePassword)} className='space-y-4'>
          <div>
            <Label htmlFor='currentPassword' className='text-sm font-medium text-slate-700 mb-1.5 block'>
              Current Password
            </Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              <Input
                id='currentPassword'
                type='password'
                name='currentPassword'
                required
                className='pl-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-transparent'
                {...register('currentPassword')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor='newPassword' className='text-sm font-medium text-slate-700 mb-1.5 block'>
              New Password
            </Label>
            <div className='relative'>
              <ShieldCheck className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              <Input
                id='newPassword'
                type='password'
                name='newPassword'
                required
                className='pl-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-transparent'
                {...register('newPassword')}
              />
            </div>
            <PasswordValidator password={password} setIsPasswordValid={setIsPasswordValid} />
          </div>

          <button
            type='submit'
            disabled={!currentPassword || !password || !isPasswordValid || loading}
            className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm text-sm'
          >
            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <ShieldCheck className='h-4 w-4' />}
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
