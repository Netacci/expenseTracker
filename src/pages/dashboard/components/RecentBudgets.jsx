/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import Empty from '../../../components/empty/Empty';
import { currencySymbol } from '../../../utils/helper';

const RecentBudgets = ({ budgets }) => {
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleBudgetClick = (budget) => {
    setSelectedBudget(budget);
  };

  const sortedByDate =
    budgets &&
    [...budgets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  return (
    <Card className='pb-6'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Recent Budgets</h2>
          <Button asChild>
            <Link to='/budgets'>View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {budgets?.length === 0 || !budgets ? (
          <Empty
            text="You don't have any budget"
            subtext='  Get started by creating a new budget.'
          />
        ) : (
          <ul className='space-y-2'>
            {sortedByDate?.map((budget) => (
              <li
                key={budget.id}
                className='flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer'
                onClick={() => handleBudgetClick(budget)}
              >
                <div>
                  <p className='font-semibold'>{budget.name}</p>

                  <p className='text-sm text-gray-500'>
                    {format(new Date(budget.created_at), 'PPP')}
                  </p>
                </div>

                <p
                // className={`font-bold ${
                //   Budget.type === 'income'
                //     ? 'text-green-500'
                //     : 'text-red-500'
                // }`}
                >
                  {currencySymbol(budget?.currency)}{' '}
                  {Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(budget?.total_budget || 0.0)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <Sheet
          open={!!selectedBudget}
          onOpenChange={() => setSelectedBudget(null)}
        >
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Budget Details</SheetTitle>
            </SheetHeader>
            {selectedBudget && (
              <div className='mt-6 space-y-4'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Name</p>
                  <p className='mt-1 text-lg font-semibold text-gray-900'>
                    {selectedBudget?.name}
                  </p>
                </div>
                {selectedBudget?.description && (
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Description
                    </p>
                    <p className='mt-1 text-lg font-semibold text-gray-900'>
                      {selectedBudget?.description}
                    </p>
                  </div>
                )}

                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Start Date
                  </p>
                  <p className='mt-1 text-lg font-semibold text-gray-900'>
                    {format(new Date(selectedBudget?.start_date), 'PPP')}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>End Date</p>
                  <p className='mt-1 text-lg font-semibold text-gray-900'>
                    {format(new Date(selectedBudget?.end_date), 'PPP')}
                  </p>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default RecentBudgets;
