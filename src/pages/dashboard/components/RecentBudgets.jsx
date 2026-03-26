/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Empty from '../../../components/empty/Empty';
import { currencySymbol, formatAmount } from '../../../utils/helper';
import { ArrowRight, Calendar, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { docId } from '../../../utils/docId';
import { ROUTES } from '../../../utils/routes';

const RecentBudgets = ({ budgets }) => {
  const [selectedBudget, setSelectedBudget] = useState(null);

  const sortedByDate =
    budgets &&
    [...budgets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

  const fmt = (n) => formatAmount(n);

  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-card'>
      <div className='flex items-center justify-between px-5 py-4 border-b border-slate-50'>
        <div>
          <h3 className='text-base font-bold text-slate-900'>Recent Budgets</h3>
          <p className='text-xs text-slate-400 mt-0.5'>Your most recently created budgets</p>
        </div>
        <Button asChild variant='ghost' className='text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-semibold h-auto py-1.5 px-3'>
          <Link to={ROUTES.budgets} className='flex items-center gap-1.5'>
            View all <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </Button>
      </div>

      <div className='p-5'>
        {!budgets?.length ? (
          <Empty
            text="No budgets yet"
            subtext='Create your first budget to start tracking'
          />
        ) : (
          <ul className='space-y-2'>
            {sortedByDate?.map((budget) => {
              const pid = docId(budget);
              const firstBucketId = budget?.buckets?.length
                ? docId(budget.buckets[0])
                : null;
              const isOverBudget = budget.total_expenses > budget.total_income;
              const spendPercent = budget.total_income > 0
                ? Math.min((budget.total_expenses / budget.total_income) * 100, 100)
                : 0;

              return (
                <li
                  key={pid}
                  className='flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group'
                  onClick={() => setSelectedBudget(budget)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isOverBudget ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                    {isOverBudget ? (
                      <TrendingDown className='h-5 w-5 text-rose-500' />
                    ) : (
                      <TrendingUp className='h-5 w-5 text-emerald-500' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-slate-900 truncate'>{budget.name}</p>
                    <div className='flex items-center gap-2 mt-0.5'>
                      <div className='h-1 flex-1 bg-slate-100 rounded-full overflow-hidden'>
                        <div
                          className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-rose-400' : 'bg-emerald-400'}`}
                          style={{ width: `${spendPercent}%` }}
                        />
                      </div>
                      <span className='text-xs text-slate-400 flex-shrink-0'>{Math.round(spendPercent)}%</span>
                    </div>
                  </div>
                  <div className='text-right flex-shrink-0'>
                    <p className='text-sm font-bold text-slate-900'>
                      {currencySymbol(budget?.currency)} {fmt(budget?.total_budget)}
                    </p>
                    <p className='text-xs text-slate-400 mt-0.5'>
                      {format(new Date(budget.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className='flex items-center gap-1 flex-shrink-0'>
                    <Link
                      to={`/plans/${pid}?tab=income`}
                      onClick={(e) => e.stopPropagation()}
                      title='Add income'
                      className='p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors'
                    >
                      <PlusCircle className='h-3.5 w-3.5' />
                    </Link>
                    <Link
                      to={
                        firstBucketId
                          ? `/plans/${pid}/buckets/${firstBucketId}?tab=expenses`
                          : `/plans/${pid}`
                      }
                      onClick={(e) => e.stopPropagation()}
                      title='Add expense'
                      className='p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors'
                    >
                      <PlusCircle className='h-3.5 w-3.5' />
                    </Link>
                    <ArrowRight className='h-4 w-4 text-slate-300 group-hover:text-slate-400 transition-colors ml-1' />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Sheet open={!!selectedBudget} onOpenChange={() => setSelectedBudget(null)}>
        <SheetContent className='w-full sm:max-w-md'>
          <SheetHeader>
            <SheetTitle className='text-xl'>Budget Details</SheetTitle>
          </SheetHeader>
          {selectedBudget && (
            <div className='mt-6 space-y-5'>
              <div className='bg-emerald-50 rounded-2xl p-4'>
                <p className='text-xs font-medium text-emerald-700 mb-1'>Budget Name</p>
                <p className='text-lg font-bold text-slate-900'>{selectedBudget?.name}</p>
              </div>
              {selectedBudget?.description && (
                <div>
                  <p className='text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide'>Description</p>
                  <p className='text-slate-700'>{selectedBudget?.description}</p>
                </div>
              )}
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-slate-50 rounded-xl p-3'>
                  <div className='flex items-center gap-1.5 mb-1'>
                    <Calendar className='h-3.5 w-3.5 text-slate-400' />
                    <p className='text-xs font-medium text-slate-400'>Start Date</p>
                  </div>
                  <p className='font-semibold text-slate-800 text-sm'>
                    {format(new Date(selectedBudget?.start_date), 'PPP')}
                  </p>
                </div>
                <div className='bg-slate-50 rounded-xl p-3'>
                  <div className='flex items-center gap-1.5 mb-1'>
                    <Calendar className='h-3.5 w-3.5 text-slate-400' />
                    <p className='text-xs font-medium text-slate-400'>End Date</p>
                  </div>
                  <p className='font-semibold text-slate-800 text-sm'>
                    {format(new Date(selectedBudget?.end_date), 'PPP')}
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-emerald-50 rounded-xl p-3'>
                  <p className='text-xs font-medium text-slate-400 mb-1'>Income</p>
                  <p className='font-bold text-emerald-700'>
                    {currencySymbol(selectedBudget?.currency)}{' '}
                    {formatAmount(selectedBudget?.total_income)}
                  </p>
                </div>
                <div className='bg-rose-50 rounded-xl p-3'>
                  <p className='text-xs font-medium text-slate-400 mb-1'>Expenses</p>
                  <p className='font-bold text-rose-600'>
                    {currencySymbol(selectedBudget?.currency)}{' '}
                    {formatAmount(selectedBudget?.total_expenses)}
                  </p>
                </div>
              </div>
              <Button asChild className='w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl'>
                <Link to={`/plans/${docId(selectedBudget)}`}>Open plan</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RecentBudgets;
