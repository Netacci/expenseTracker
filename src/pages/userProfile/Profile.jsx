/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Layout from '../../components/navbar/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { editAccount, fetchUserDetails } from '../../redux/userSlice';
import { useForm } from 'react-hook-form';
import {
  showErrorMessage,
  showToastMessage,
} from '../../components/toast/Toast';
import { Toaster } from 'react-hot-toast';

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
    const submitData = {
      first_name: data.name,
    };
    dispatch(editAccount(submitData))
      .unwrap()
      .then(() => {
        setLoading(false);
        showToastMessage('Profile updated successfully');
      })
      .catch((err) => {
        setLoading(false);
        showErrorMessage(
          err?.response?.data?.message || 'Profile update failed'
        );
      });
  };

  return (
    <Layout>
      <Toaster />
      <Card>
        <CardHeader>
          <h2 className='text-2xl font-bold'>Edit Profile</h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleEditProfile)}
            className='space-y-4'
          >
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                type='text'
                required
                {...register('name')}
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                disabled
                id='email'
                type='email'
                name='email'
                required
                {...register('email')}
              />
            </div>
            <Button type='submit'>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Profile;
