/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { format, isValid } from 'date-fns';

function safeFormat(value, fmt = 'PPP') {
  if (value == null || value === '') return '—';
  const d = value instanceof Date ? value : new Date(value);
  return isValid(d) ? format(d, fmt) : '—';
}

/**
 * `budget` is either a monthly plan or a bucket (spending group).
 * Buckets don't have start/end — pass `plan` for the plan month range.
 */
const BudgetInfo = ({ isOpen, isClose, budget, plan }) => {
  const startDate = budget?.start_date ?? plan?.start_date;
  const endDate = budget?.end_date ?? plan?.end_date;
  const isBucket = plan != null && budget != null && !budget?.start_date && !budget?.end_date;

  return (
    <Sheet open={isOpen} onOpenChange={isClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Details</SheetTitle>
        </SheetHeader>

        <div className='mt-6 space-y-4'>
          <div>
            <p className='text-sm font-medium text-gray-500'>Name</p>
            <p className='mt-1 text-lg font-semibold text-gray-900'>
              {budget?.name}
            </p>
          </div>
          {budget?.description && (
            <div>
              <p className='text-sm font-medium text-gray-500'>Description</p>
              <p className='mt-1 text-lg font-semibold text-gray-900'>
                {budget?.description}
              </p>
            </div>
          )}

          <div>
            <p className='text-sm font-medium text-gray-500'>Created</p>
            <p className='mt-1 text-lg font-semibold text-gray-900'>
              {safeFormat(budget?.created_at)}
            </p>
          </div>

          {isBucket && (
            <p className='text-sm text-slate-500'>
              Date range below is for the <strong>monthly plan</strong> this spending area belongs to.
            </p>
          )}

          <div>
            <p className='text-sm font-medium text-gray-500'>
              {isBucket ? 'Plan period (start)' : 'Start date'}
            </p>
            <p className='mt-1 text-lg font-semibold text-gray-900'>
              {safeFormat(startDate)}
            </p>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-500'>
              {isBucket ? 'Plan period (end)' : 'End date'}
            </p>
            <p className='mt-1 text-lg font-semibold text-gray-900'>
              {safeFormat(endDate)}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BudgetInfo;
