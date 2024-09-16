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
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  createCategory,
  editCategory,
  fetchAllCategories,
} from '../../../redux/expenseSlice';
import {
  showErrorMessage,
  showToastMessage,
} from '../../../components/toast/Toast';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { fetchSingleBudget } from '../../../redux/budgetSlice';

const AddNewCategory = ({
  isAddCategoryOpen,
  setIsAddCategoryOpen,
  editingCategory,
  setEditingCategory,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      name: editingCategory?.name || '',
      amount: editingCategory?.amount || 0,
      date: editingCategory?.date || '',
    },
  });

  useEffect(() => {
    if (editingCategory) {
      setValue('name', editingCategory?.name);
      setValue('amount', editingCategory?.amount);
      setValue('date', editingCategory?.date);
    } else {
      setValue('name', '');
      setValue('amount', 0);
      setValue('date', '');
    }
  }, [editingCategory, setValue]);
  const handleCreateNewCategory = async (data) => {
    try {
      setLoading(true);
      const submitData = {
        name: data.name,
        amount: data.amount,

        id,
        ...(editingCategory && { category_id: editingCategory?._id }),
      };
      const updateCategory = editingCategory ? editCategory : createCategory;
      await dispatch(updateCategory(submitData)).unwrap();
      setLoading(false);
      setIsAddCategoryOpen(false);
      showToastMessage(
        editingCategory ? 'Category updated' : 'Category created successfully'
      );
      await dispatch(fetchAllCategories(id)).unwrap();
      await dispatch(fetchSingleBudget(id)).unwrap();
      if (editingCategory) {
        setEditingCategory(null);
      }
      setValue('name', '');
      setValue('amount', 0);
      setValue('date', '');
    } catch (err) {
      setLoading(false);
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
    }
  };
  const handleClose = () => {
    setIsAddCategoryOpen(false);
  };
  return (
    <Dialog open={isAddCategoryOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[400px] '>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        <form
          className='space-y-4'
          onSubmit={handleSubmit(handleCreateNewCategory)}
        >
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name', { required: 'Category name is required' })}
              className='w-full'
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='amount'>Budget Amount</Label>
            <Input
              id='amount'
              type='number'
              {...register('amount', {
                required: 'Budget amount is required',
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
          <DialogFooter>
            <Button type='submit'>
              {loading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : editingCategory ? (
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

export default AddNewCategory;
