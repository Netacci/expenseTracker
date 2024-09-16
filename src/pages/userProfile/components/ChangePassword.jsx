import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../../redux/userSlice';
import { useState } from 'react';
import {
  showErrorMessage,
  showToastMessage,
} from '../../../components/toast/Toast';
import PasswordValidator from '../../auth/components/PasswordValidator';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });
  const handleChangePassword = (data) => {
    setLoading(true);

    const submitData = {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    dispatch(changePassword(submitData))
      .unwrap()
      .then(() => {
        setLoading(false);
        showToastMessage('Password changed successfully');
      })
      .catch((err) => {
        showErrorMessage(
          err?.response?.data?.message || 'Password Reset Failed'
        );
        setLoading(false);
      });
  };
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const password = watch('newPassword');
  return (
    <Card>
      <CardHeader>
        <h2 className='text-2xl font-bold'>Change Password</h2>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className='space-y-4'
        >
          <div>
            <Label htmlFor='currentPassword'>Current Password</Label>
            <Input
              id='currentPassword'
              type='text'
              name='currentPassword'
              required
              {...register('currentPassword')}
            />
          </div>
          <div>
            <Label htmlFor='newPassword'>New Password</Label>
            <Input
              id='newPassword'
              type='text'
              name='newPassword'
              required
              {...register('newPassword')}
            />
          </div>
          <PasswordValidator
            password={password}
            setIsPasswordValid={setIsPasswordValid}
          />

          <Button
            type='submit'
            disabled={!password || !isPasswordValid || loading}
          >
            {loading ? <span>Loading...</span> : 'Change Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
