/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DateInput from '../../../components/dateInput/DateInput';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  createIncome,
  editIncome,
  fetchAllIncomes,
} from '../../../redux/incomeSlice';
import { useEffect, useState } from 'react';
import {
  showErrorMessage,
  showToastMessage,
} from '../../../components/toast/Toast';

import { Loader2 } from 'lucide-react';
import { fetchSingleBudget } from '../../../redux/budgetSlice';
const AddNewIncome = ({
  isAddIncomeOpen,
  setIsAddIncomeOpen,
  editingIncome,
  setEditingIncome,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      name: editingIncome?.name || '',
      amount: editingIncome?.amount || 0,
      date: editingIncome?.date || '',
    },
  });

  useEffect(() => {
    if (editingIncome) {
      setValue('name', editingIncome?.name);
      setValue('amount', editingIncome?.amount);
      setValue('date', editingIncome?.date);
    } else {
      setValue('name', '');
      setValue('amount', 0);
      setValue('date', '');
    }
  }, [editingIncome, setValue]);
  const handleAddIncome = async (data) => {
    try {
      setLoading(true);
      const submitData = {
        name: data.name,
        amount: data.amount,
        date: data.date,
        id,
        ...(editingIncome && { income_id: editingIncome?.id }),
      };
      const updateIncome = editingIncome ? editIncome : createIncome;
      await dispatch(updateIncome(submitData)).unwrap();
      setLoading(false);
      setIsAddIncomeOpen(false);
      showToastMessage(
        editingIncome
          ? 'Income updated successfully'
          : 'Income added successfully'
      );
      await dispatch(fetchAllIncomes(id)).unwrap();
      await dispatch(fetchSingleBudget(id)).unwrap();
      if (editingIncome) {
        setEditingIncome(null);
      }
      setValue('name', '');
      setValue('amount', 0);
      setValue('date', '');
    } catch (error) {
      setLoading(false);

      showErrorMessage(
        error.message || editingIncome
          ? 'Failed to update Income'
          : 'Failed to add Income'
      );
    }
  };
  return (
    <Dialog
      open={isAddIncomeOpen}
      onOpenChange={() => setIsAddIncomeOpen(!isAddIncomeOpen)}
    >
      <DialogContent className='sm:max-w-[400px] '>
        <DialogHeader>
          <DialogTitle>
            {editingIncome ? 'Edit Income' : 'Add New Income'}
          </DialogTitle>
        </DialogHeader>
        <form className='space-y-4 ' onSubmit={handleSubmit(handleAddIncome)}>
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name', { required: 'Name is required' })}
              className='w-full'
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor='amount'>Amount</Label>
            <Input
              id='amount'
              type='number'
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
          <DateInput
            label={'Date'}
            name={'date'}
            control={control}
            errors={errors}
          />
          <DialogFooter>
            <Button type='submit'>
              {loading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : editingIncome ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewIncome;
