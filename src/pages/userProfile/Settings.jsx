import Layout from '../../components/navbar/Layout';
import { Toaster } from 'react-hot-toast';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';

const Settings = () => {
  return (
    <Layout>
      <Toaster />
      <div className='space-y-6'>
        <ChangePassword />
        <DeleteAccount />
      </div>
    </Layout>
  );
};

export default Settings;
