/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import DateInput from '../../../components/dateInput/DateInput';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  createExpense,
  deleteExpense,
  editExpense,
  fetchAllCategories,
  fetchAllExpenses,
  fetchRecentExpenses,
  resetExpenses,
} from '../../../redux/expenseSlice';
import { showErrorMessage } from '../../../components/toast/Toast';
import { currencySymbol, startProgressInterval } from '../../../utils/helper';
import { Progress } from '@/components/ui/progress';
import { fetchSingleBudget } from '../../../redux/budgetSlice';

const AddExpense = ({
  selectedCategoryExpense,
  setSelectedCategoryExpense,
  currency,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { expenses } = useSelector((state) => state.expense);
  const [editingExpense, setEditingExpense] = useState(null);

  const [deletingExpense, setDeletingExpense] = useState({});

  const {
    control,
    formState: { errors },
    register,
    reset,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      name: editingExpense?.name || '',
      amount: editingExpense?.amount || 0,
      date: editingExpense?.date || '',
    },
  });
  useEffect(() => {
    if (selectedCategoryExpense) {
      dispatch(
        fetchAllExpenses({ id, category_id: selectedCategoryExpense?.id })
      );
    }
  }, [selectedCategoryExpense, dispatch, id]);
  useEffect(() => {
    if (editingExpense) {
      setValue('name', editingExpense?.name);
      setValue('amount', editingExpense?.amount);
      setValue('date', editingExpense?.date);
    } else {
      setValue('name', '');
      setValue('amount', 0);
      setValue('date', '');
    }
  }, [editingExpense, setValue]);
  const handleAddExpense = async (data) => {
    try {
      setIsLoading(true);
      const submitData = {
        name: data.name,
        amount: data?.amount,
        date: data?.date,
        id,
        category_id: selectedCategoryExpense?.id,
        ...(editingExpense && { expense_id: editingExpense?.id }),
      };
      const updateExpense = editingExpense ? editExpense : createExpense;
      await dispatch(updateExpense(submitData)).unwrap();

      await dispatch(
        fetchAllExpenses({ id, category_id: selectedCategoryExpense?.id })
      ).unwrap();
      setIsLoading(false);
      reset({
        name: '',
        amount: 0,
        date: '',
      });
      setEditingExpense(null);

      await dispatch(fetchSingleBudget(id)).unwrap();
      await dispatch(fetchAllCategories(id)).unwrap();
      await dispatch(fetchRecentExpenses(id)).unwrap();
    } catch (err) {
      setIsLoading(false);
      showErrorMessage(err.message || 'Failed to add expense');
    }
  };
  const handleDeleteExpense = async (expense_id) => {
    try {
      setDeletingExpense((prev) => ({
        ...prev,
        [expense_id]: { isDeleting: true, progress: 0 },
      }));
      const intervalId = await startProgressInterval(
        expense_id,
        setDeletingExpense
      );
      await dispatch(
        deleteExpense({
          id,
          category_id: selectedCategoryExpense?.id,
          expense_id,
        })
      ).unwrap();

      await dispatch(
        fetchAllExpenses({ id, category_id: selectedCategoryExpense?.id })
      ).unwrap();
      await dispatch(fetchAllCategories(id)).unwrap();
      await dispatch(fetchSingleBudget(id)).unwrap();
      await dispatch(fetchRecentExpenses(id)).unwrap();
      setEditingExpense(null);
      setDeletingExpense((prev) => ({
        ...prev,
        [expense_id]: { isDeleting: false, progress: 0 },
      }));
      clearInterval(intervalId);
    } catch (err) {
      showErrorMessage(err.message || 'Failed to delete expense');

      setDeletingExpense((prev) => ({
        ...prev,
        [expense_id]: { isDeleting: false, progress: 0 },
      }));
    }
  };
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };
  const handleClose = () => {
    setSelectedCategoryExpense(null);
    setEditingExpense(null);
    dispatch(resetExpenses());
  };
  return (
    <Sheet open={!!selectedCategoryExpense} onOpenChange={handleClose}>
      <SheetContent className='px-2 sm:px-6 sm max-h-[100vh] overflow-auto'>
        <SheetHeader>
          <SheetTitle className='text-left'>Expenses</SheetTitle>
        </SheetHeader>

        {expenses ? (
          <div className='mt-4'>
            <ul className='space-y-3'>
              {expenses?.map((expense) => (
                <li
                  key={expense.id}
                  className='flex flex-col bg-white p-3 rounded-lg shadow-sm border border-gray-200'
                >
                  <div className='flex justify-between items-center flex-wrap'>
                    <div className='flex flex-col '>
                      <span className='font-medium text-gray-800'>
                        {expense.name}
                      </span>
                      <span className='text-sm text-gray-500'>
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className='flex items-center flex-wrap space-x-1'>
                      <span className='font-semibold text-red-600'>
                        {currencySymbol(currency)}{' '}
                        {Intl.NumberFormat('en-US', {
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(expense.amount || 0)}
                      </span>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEditExpense(expense)}
                        className='text-gray-500 hover:text-blue-600'
                        disabled={deletingExpense[expense.id]?.isDeleting}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDeleteExpense(expense.id)}
                        className='text-gray-500 hover:text-red-600'
                        disabled={deletingExpense[expense.id]?.isDeleting}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  {deletingExpense[expense.id]?.isDeleting && (
                    <div className='mt-2'>
                      <Progress
                        value={deletingExpense[expense.id]?.progress}
                        className='w-full h-1'
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <form className='mt-4' onSubmit={handleSubmit(handleAddExpense)}>
              <div className='mb-2'>
                <Input
                  placeholder='Expense name'
                  id='name'
                  {...register('name', { required: 'Name is required' })}
                  className='w-full'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className='mb-2'>
                <Input
                  id='amount'
                  type='number'
                  placeholder='Amount'
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 0, message: 'Amount must be positive' },
                  })}
                  className='w-full'
                />
                {errors.amount && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <DateInput name={'date'} control={control} errors={errors} />
              <div className='mt-2'>
                <Button className='mt-2' type='submit'>
                  {isLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : editingExpense ? (
                    'Update Expense'
                  ) : (
                    'Add Expense'
                  )}
                </Button>
                {editingExpense && (
                  <Button
                    variant='ghost'
                    className='mt-2'
                    onClick={() => setEditingExpense(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <>
            <form className='mt-4' onSubmit={handleSubmit(handleAddExpense)}>
              <div className='mb-2'>
                <Input
                  placeholder='Expense name'
                  id='name'
                  {...register('name', { required: 'Name is required' })}
                  className='w-full'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className='mb-2'>
                <Input
                  id='amount'
                  type='number'
                  placeholder='Amount'
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 0, message: 'Amount must be positive' },
                  })}
                  className='w-full'
                />
                {errors.amount && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <DateInput name={'date'} control={control} errors={errors} />
              <div className='mt-2'>
                <Button className='mt-2' type='submit'>
                  {isLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : editingExpense ? (
                    'Update Expense'
                  ) : (
                    'Add Expense'
                  )}
                </Button>
                {editingExpense && (
                  <Button
                    variant='ghost'
                    className='mt-2'
                    onClick={() => setEditingExpense(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AddExpense;
