/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Empty from '../../../components/empty/Empty';
import { useDispatch, useSelector } from 'react-redux';
import { currencySymbol, startProgressInterval } from '../../../utils/helper';
import { useParams } from 'react-router-dom';
import {
  deleteCategory,
  fetchAllCategories,
} from '../../../redux/expenseSlice';
import {
  showErrorMessage,
  showToastMessage,
} from '../../../components/toast/Toast';
import DeleteModal from '../../../components/deleteModal/DeleteModal';
import AddExpense from './AddExpense';
import CustomProgress from '../../../components/customProgress/CustomProgress';
import AddNewCategory from './AddNewCategory';
import { fetchSingleBudget } from '../../../redux/budgetSlice';

const BudgetCategories = ({ currency }) => {
  const { id } = useParams();
  const { categories } = useSelector((state) => state.expense);
  const [selectedCategoryExpense, setSelectedCategoryExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const [deletingCategory, setDeletingCategory] = useState({});
  const dispatch = useDispatch();

  const handleCategoryExpenseClick = (category) => {
    setSelectedCategoryExpense(category);
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsAddCategoryOpen(true);
  };
  useEffect(() => {
    dispatch(fetchAllCategories(id));
  }, [dispatch, id]);

  const handleOpenDelete = (category) => {
    setShowDeleteConfirm(true);
    setSelectedCategory(category);
  };
  const handleCloseDelete = () => {
    if (!isDeleting) {
      setShowDeleteConfirm(false);
    }
  };
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeletingCategory((prev) => ({
        ...prev,
        [selectedCategory.id]: { isDeleting: true, progress: 0 },
      }));
      const intervalId = startProgressInterval(
        selectedCategory.id,
        setDeletingCategory
      );
      await dispatch(
        deleteCategory({ id, category_id: selectedCategory.id })
      ).unwrap();
      await dispatch(fetchAllCategories(id)).unwrap();
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      showToastMessage('Category deleted successfully');
      await dispatch(fetchSingleBudget(id)).unwrap();
      setSelectedCategory(null);
      setDeletingCategory((prev) => ({
        ...prev,
        [selectedCategory.id]: { isDeleting: false, progress: 0 },
      }));
      clearInterval(intervalId);
    } catch (err) {
      setIsDeleting(false);
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
      setDeletingCategory((prev) => ({
        ...prev,
        [selectedCategory.id]: { isDeleting: false, progress: 0 },
      }));
    }
  };
  const sortedCategories =
    categories &&
    [...categories].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

  return (
    <div className='mb-6'>
      {categories?.length === 0 ? (
        <Empty
          text='No Expense category added yet'
          subtext={'Add new category'}
          onAddAction={() => setIsAddCategoryOpen(true)}
        />
      ) : (
        <div className='space-y-4'>
          {sortedCategories?.map((category) => {
            const progress = (category.total_expenses / category.amount) * 100;
            return (
              <Card
                key={category.id}
                className={'cursor-pointer hover:bg-gray-50 shadow'}
              >
                <CardHeader className='flex flex-row justify-between items-center  space-y-0 pb-2'>
                  <h3
                    onClick={() => handleCategoryExpenseClick(category)}
                    className='font-bold capitalize'
                  >
                    {category.name}
                  </h3>
                  <div>
                    <Button
                      onClick={() => handleCategoryClick(category)}
                      variant='ghost'
                      size='icon'
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      onClick={() => handleOpenDelete(category)}
                      variant='ghost'
                      size='icon'
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent
                  onClick={() => handleCategoryExpenseClick(category)}
                >
                  <div className='flex justify-between mb-2'>
                    <span>
                      Budget: {currencySymbol(currency)}{' '}
                      {Intl.NumberFormat('en-US', {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(category.amount || 0.0)}
                    </span>
                    <span>
                      Spent: {currencySymbol(currency)}{' '}
                      {Intl.NumberFormat('en-US', {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(category.total_expenses || 0.0)}
                    </span>
                  </div>

                  <CustomProgress value={progress} />
                </CardContent>
                {deletingCategory[category?.id]?.isDeleting && (
                  <div className='mt-2'>
                    <CustomProgress
                      value={deletingCategory[category?.id]?.progress}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      <AddExpense
        selectedCategoryExpense={selectedCategoryExpense}
        setSelectedCategoryExpense={setSelectedCategoryExpense}
        currency={currency}
      />

      <AddNewCategory
        isAddCategoryOpen={isAddCategoryOpen}
        setIsAddCategoryOpen={setIsAddCategoryOpen}
        editingCategory={selectedCategory}
        setEditingCategory={setSelectedCategory}
      />

      <DeleteModal
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        name={selectedCategory?.name}
        label='category'
        handleCloseDelete={handleCloseDelete}
      />
    </div>
  );
};

export default BudgetCategories;
