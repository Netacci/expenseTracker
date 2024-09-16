/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { format } from 'date-fns';

const BudgetInfo = ({ isOpen, isClose, budget }) => {
  return (
    <Sheet open={isOpen} onOpenChange={isClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Budget Details</SheetTitle>
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
            <p className='text-sm font-medium text-gray-500'>Created Date</p>
            <p className='mt-1 text-lg font-semibold text-gray-900'>
              {budget && format(new Date(budget?.created_at), 'PPP')}
            </p>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-500'>
              Budget Start Date
            </p>
            <p className='mt-1 text-lg font-semibold text-gray-900'>
              {budget && format(new Date(budget?.start_date), 'PPP')}
            </p>
          </div>
          <div>
            <p className='text-sm font-medium text-gray-500'>Budget End Date</p>
            <p className='mt-1 text-lg font-semibold text-gray-900'>
              {budget && format(new Date(budget?.end_date), 'PPP')}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BudgetInfo;
