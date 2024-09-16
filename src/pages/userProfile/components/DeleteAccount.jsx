import { Button } from '@/components/ui/button';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { deleteUser } from '../../../redux/userSlice';
import {
  showErrorMessage,
  showToastMessage,
} from '../../../components/toast/Toast';
import { ROUTES } from '../../../utils/routes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteAccount = () => {
    setIsDeleting(true);
    dispatch(deleteUser())
      .unwrap()
      .then(() => {
        showToastMessage('Account deleted successfully');
        setIsDeleting(false);
        navigate(ROUTES.login);
      })
      .catch((err) => {
        setIsDeleting(false);
        showErrorMessage(
          err?.response?.data?.message || 'Something went wrong. Try again!'
        );
      });
  };
  return (
    <Card>
      <CardHeader>
        <h2 className='text-2xl font-bold'>Delete Account</h2>
      </CardHeader>
      <CardContent>
        {!showDeleteConfirm ? (
          <Button
            variant='destructive'
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </Button>
        ) : (
          <div className='space-y-4'>
            <Alert variant='destructive'>
              <AlertDescription>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </AlertDescription>
            </Alert>
            <div className='flex space-x-4'>
              <Button variant='destructive' onClick={handleDeleteAccount}>
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeleteAccount;
