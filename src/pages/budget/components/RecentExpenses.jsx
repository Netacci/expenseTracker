/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import Empty from '../../../components/empty/Empty';
import { currencySymbol } from '../../../utils/helper';
import { docId } from '../../../utils/docId';
import { Receipt } from 'lucide-react';

const RecentExpenses = ({ expenses, currency }) => {
  const fmt = (n) =>
    Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(n || 0);

  return (
    <div className='mb-6'>
      <div className='flex items-center gap-2 mb-4'>
        <h3 className='text-lg font-bold text-slate-900'>Recent Expenses</h3>
        <span className='text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium'>
          Latest transactions
        </span>
      </div>

      <div className='bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden'>
        {!expenses?.length ? (
          <div className='p-8'>
            <Empty text='No expenses recorded' subtext='Add expenses from a category above' />
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className='grid grid-cols-4 px-4 py-3 border-b border-slate-50 bg-slate-50/80'>
              <span className='text-xs font-semibold text-slate-400 uppercase tracking-wide'>Date</span>
              <span className='text-xs font-semibold text-slate-400 uppercase tracking-wide'>Name</span>
              <span className='text-xs font-semibold text-slate-400 uppercase tracking-wide'>Category</span>
              <span className='text-xs font-semibold text-slate-400 uppercase tracking-wide text-right'>Amount</span>
            </div>
            {/* Table rows */}
            <div className='divide-y divide-slate-50'>
              {expenses.map((expense) => (
                <div key={docId(expense)} className='grid grid-cols-4 items-center px-4 py-3 hover:bg-slate-50/60 transition-colors'>
                  <span className='text-sm text-slate-500'>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                  <div className='flex items-center gap-2'>
                    <div className='w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Receipt className='h-3.5 w-3.5 text-rose-500' />
                    </div>
                    <span className='text-sm font-medium text-slate-800 truncate'>{expense.name}</span>
                  </div>
                  <span className='text-sm text-slate-500 truncate'>{expense.categoryName}</span>
                  <span className='text-sm font-bold text-rose-600 text-right'>
                    {currencySymbol(currency)} {fmt(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;
