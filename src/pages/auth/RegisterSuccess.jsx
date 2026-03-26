import { CheckCircle, LogIn, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const RegistrationSuccessful = () => {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12'>
      <div className='w-full max-w-md text-center'>
        <div className='flex justify-center mb-6'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center'>
              <DollarSign className='h-5 w-5 text-white' />
            </div>
            <span className='text-slate-900 font-bold text-xl'>ExpenseTracker</span>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-card border border-slate-100 p-8'>
          <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5'>
            <CheckCircle className='h-8 w-8 text-emerald-600' />
          </div>
          <h2 className='text-2xl font-bold text-slate-900 mb-3'>
            Account created!
          </h2>
          <p className='text-slate-500 text-sm leading-relaxed mb-6'>
            Welcome aboard! Please check your email to verify your account. You&apos;ll need to verify before logging in.
          </p>
          <button
            onClick={() => navigate(ROUTES.login)}
            className='w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md'
          >
            <LogIn className='h-4 w-4' />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessful;
