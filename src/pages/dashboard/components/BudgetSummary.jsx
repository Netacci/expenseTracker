/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BudgetSummary = ({ budgets }) => {
  const [selectedBudget, setSelectedBudget] = useState(budgets[0]?.id || '');

  const currentBudget = budgets.find(
    (budget) => budget.id === selectedBudget
  ) || {
    name: '',
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  };

  return (
    <div className='space-y-4'>
      <Select value={selectedBudget} onValueChange={setSelectedBudget}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a budget' />
        </SelectTrigger>
        <SelectContent>
          {budgets.map((budget) => (
            <SelectItem key={budget.id} value={budget.id}>
              {budget.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>Total Income</CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-green-500'>
              ${currentBudget.totalIncome}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Total Expenses</CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-red-500'>
              ${currentBudget.totalExpenses}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Balance</CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                currentBudget.balance >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              ${currentBudget.balance}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetSummary;
