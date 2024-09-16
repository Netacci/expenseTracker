/* eslint-disable react/prop-types */
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Empty from '../../../components/empty/Empty';

const RecentExpenses = ({ expenses, categories }) => {
  return (
    <div className='mb-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Recent Expenses</h2>
      </div>
      <Card className='mt-6 pt-2'>
        <CardContent>
          <Table className='w-full '>
            <TableHeader>
              <TableRow className='text-left'>
                <TableHead className='pb-2'>Date</TableHead>
                <TableHead className='pb-2'>Name</TableHead>
                <TableHead className='pb-2'>Category</TableHead>
                <TableHead className='pb-2 text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>
            {expenses?.length === 0 || !expenses ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className='h-[300px] text-center'>
                    <Empty
                      text='No expenses'
                      subtext={'No expenses added yet.'}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : null}
            <TableBody>
              {expenses?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className='py-2 '>
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className='py-2'>{expense.name}</TableCell>
                  <TableCell className='py-2'>
                    {categories?.find((c) => c.id === expense.categoryId)?.name}
                  </TableCell>
                  <TableCell className='py-2 text-right'>
                    ${expense.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentExpenses;
