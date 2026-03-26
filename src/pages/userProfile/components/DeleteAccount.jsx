import { useState } from 'react';
import { deleteUser } from '../../../redux/userSlice';
import { showErrorMessage, showToastMessage } from '../../../components/toast/Toast';
import { ROUTES } from '../../../utils/routes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

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
        showErrorMessage(err?.response?.data?.message || 'Something went wrong. Try again!');
      });
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden'>
      <div className='flex items-center gap-3 px-6 py-4 border-b border-slate-50'>
        <div className='w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center'>
          <Trash2 className='h-4 w-4 text-rose-600' />
        </div>
        <div>
          <h3 className='font-bold text-slate-900 text-base'>Delete Account</h3>
          <p className='text-xs text-slate-400'>Permanently remove your account and all data</p>
        </div>
      </div>
      <div className='p-6'>
        {!showDeleteConfirm ? (
          <div>
            <p className='text-sm text-slate-500 mb-4'>
              Once you delete your account, there is no going back. All your budgets, expenses, and income data will be permanently erased.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className='flex items-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm'
            >
              <Trash2 className='h-4 w-4' />
              Delete Account
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4'>
              <AlertTriangle className='h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5' />
              <div>
                <p className='text-sm font-semibold text-rose-800'>This action is irreversible</p>
                <p className='text-sm text-rose-700 mt-0.5'>
                  All your budgets, expenses, income data, and account information will be permanently deleted.
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className='flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm'
              >
                {isDeleting ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className='h-4 w-4' />
                    Yes, delete my account
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className='px-5 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
