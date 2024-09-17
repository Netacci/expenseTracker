/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch } from 'react-redux';
import {
  createBudget,
  editBudget,
  fetchAllBudgets,
  fetchSingleBudget,
  resetBudget,
} from '../../../redux/budgetSlice';
import {
  showErrorMessage,
  showToastMessage,
} from '../../../components/toast/Toast';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import DateInput from '../../../components/dateInput/DateInput';
import { Loader2 } from 'lucide-react';

const AddBudgetForm = ({ isOpen, onClose, budget }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      name: budget?.name || '',
      currency: budget?.currency || 'USD',
      startDate: budget?.start_date || '',
      endDate: budget?.end_date || '',
      description: budget?.description || '',
    },
  });
  const { name, currency, startDate, endDate } = watch();

  useEffect(() => {
    if (budget) {
      setValue('name', budget?.name);
      setValue('currency', budget?.currency);
      setValue('startDate', budget?.start_date);
      setValue('endDate', budget?.end_date);
      setValue('description', budget?.description);
    } else {
      setValue('name', '');
      setValue('currency', 'USD');
      setValue('startDate', '');
      setValue('endDate', '');
      setValue('description', '');
    }
  }, [setValue, budget]);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      const id = budget?.id;
      const submitData = {
        name: data.name,
        currency: data.currency,
        start_date: data.startDate,
        end_date: data.endDate,
        description: data.description,
        ...(budget && { id }),
      };
      const updateBudget = budget ? editBudget : createBudget;
      const res = await dispatch(updateBudget(submitData)).unwrap();
      if (budget) {
        await dispatch(fetchSingleBudget(id)).unwrap();
        await dispatch(fetchAllBudgets()).unwrap();
      } else {
        await dispatch(fetchAllBudgets()).unwrap();
        dispatch(resetBudget());
        navigate(`/budget/${res.id}`);
      }
      onClose();
      showToastMessage(
        budget ? 'Budget updated successfully' : 'Budget created successfully'
      );
    } catch (err) {
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
    } finally {
      setLoading(false);
    }
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NGN'];
  return (
    <>
      <Toaster />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='w-full sm:max-h-[100vh] overflow-auto'>
          <SheetHeader>
            <SheetTitle>
              {' '}
              {budget ? 'Edit Budget' : 'Add New Budget'}
            </SheetTitle>{' '}
          </SheetHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Budget Name</Label>
              <Input
                id='name'
                {...register('name', { required: 'Budget name is required' })}
                className='w-full'
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='name'>Description(Optional)</Label>
              <Textarea
                id='description'
                {...register('description')}
                className='w-full'
              />

              {errors.description && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='currency'>Currency</Label>
              <Select
                onValueChange={(value) => setValue('currency', value)}
                defaultValue={budget?.currency || 'USD'}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select currency' />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DateInput
              label={'Start Date'}
              name={'startDate'}
              control={control}
              errors={errors}
            />
            <DateInput
              label={'End Date'}
              name={'endDate'}
              control={control}
              errors={errors}
            />

            <SheetFooter>
              <Button
                type='submit'
                disabled={
                  loading || !name || !currency || !startDate || !endDate
                }
              >
                {loading ? (
                  <Loader2 className='animate-spin h-4 w-4' />
                ) : budget ? (
                  'Update Budget'
                ) : (
                  'Create Budget'
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AddBudgetForm;
