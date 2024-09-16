/* eslint-disable react/prop-types */
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const TotalAmounts = ({ totalIncome, totalExpenses, balance }) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader>Total Income</CardHeader>
        <CardContent>
          <p className='text-2xl font-bold text-green-500'>${totalIncome}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>Total Expenses</CardHeader>
        <CardContent>
          <p className='text-2xl font-bold text-red-500'>${totalExpenses}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>Balance</CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            ${balance}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalAmounts;
