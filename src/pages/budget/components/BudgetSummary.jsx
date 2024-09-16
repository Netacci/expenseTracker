/* eslint-disable react/prop-types */
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Tooltipp from '../../../components/tooltip/Tooltip';

import { currencySymbol } from '../../../utils/helper';
const BudgetSummary = ({
  totalBudget,
  totalIncome,
  totalExpenses,
  currency,
  balance,
}) => {
  return (
    <div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
        <Card>
          <CardHeader className='flex justify-between items-center flex-row'>
            <span>Total Budget</span>
            <span>
              {' '}
              <Tooltipp
                text={'This is the total of all added expense category'}
              />
            </span>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {' '}
              {currencySymbol(currency)}{' '}
              {Intl.NumberFormat('en-US', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(totalBudget || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex justify-between items-center flex-row'>
            <span>Total Income</span>
            <span>
              {' '}
              <Tooltipp text={'This is the total of all added incomes'} />
            </span>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-green-500'>
              {currencySymbol(currency)}{' '}
              {Intl.NumberFormat('en-US', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(totalIncome || 0.0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex justify-between items-center flex-row'>
            <span>Total Expenses</span>
            <span>
              {' '}
              <Tooltipp text={'This is the total of all recorded expenses'} />
            </span>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-red-500'>
              {currencySymbol(currency)}{' '}
              {Intl.NumberFormat('en-US', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(totalExpenses || 0.0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex justify-between items-center flex-row'>
            <span>Remaining Balance</span>
            <span>
              {' '}
              <Tooltipp text={"This is what's left in your budget"} />
            </span>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-blue-500'>
              {currencySymbol(currency)}{' '}
              {Intl.NumberFormat('en-US', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(balance || 0.0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetSummary;
