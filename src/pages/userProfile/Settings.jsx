import Layout from '../../components/navbar/Layout';
import { Toaster } from 'react-hot-toast';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <Layout>
      <Toaster />
      <div className='max-w-2xl'>
        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-1'>
            <div className='w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center'>
              <SettingsIcon className='h-5 w-5 text-slate-600' />
            </div>
            <h2 className='text-2xl font-bold text-slate-900'>Settings</h2>
          </div>
          <p className='text-slate-500 text-sm'>Manage your account security and preferences</p>
        </div>
        <div className='space-y-4'>
          <ChangePassword />
          <DeleteAccount />
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
