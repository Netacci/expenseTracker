/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Edit, Trash2, ChevronRight, PlusCircle } from 'lucide-react';
import Empty from '../../../components/empty/Empty';
import { useDispatch, useSelector } from 'react-redux';
import { currencySymbol, startProgressInterval } from '../../../utils/helper';
import { useParams } from 'react-router-dom';
import { deleteCategory, fetchAllCategories } from '../../../redux/expenseSlice';
import { showErrorMessage, showToastMessage } from '../../../components/toast/Toast';
import DeleteModal from '../../../components/deleteModal/DeleteModal';
import AddExpense from './AddExpense';
import CustomProgress from '../../../components/customProgress/CustomProgress';
import AddNewCategory from './AddNewCategory';
import { fetchSingleBudget } from '../../../redux/budgetSlice';
import { docId } from '../../../utils/docId';

const BudgetCategories = ({
  currency,
  isAddCategoryOpen: controlledOpen,
  setIsAddCategoryOpen: setControlledOpen,
}) => {
  const { planId, bucketId } = useParams();
  const { categories } = useSelector((state) => state.expense);
  const [selectedCategoryExpense, setSelectedCategoryExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localAddOpen, setLocalAddOpen] = useState(false);
  const isControlled = typeof setControlledOpen === 'function';
  const isAddCategoryOpen = isControlled ? controlledOpen : localAddOpen;
  const setIsAddCategoryOpen = isControlled ? setControlledOpen : setLocalAddOpen;
  const [deletingCategory, setDeletingCategory] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (planId && bucketId) dispatch(fetchAllCategories({ planId, bucketId }));
  }, [dispatch, planId, bucketId]);

  const handleCategoryExpenseClick = (category) => setSelectedCategoryExpense(category);
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsAddCategoryOpen(true);
  };
  const handleOpenDelete = (category) => {
    setShowDeleteConfirm(true);
    setSelectedCategory(category);
  };
  const handleCloseDelete = () => {
    if (!isDeleting) setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    const catId = docId(selectedCategory);
    try {
      setIsDeleting(true);
      setDeletingCategory((prev) => ({
        ...prev,
        [catId]: { isDeleting: true, progress: 0 },
      }));
      const intervalId = startProgressInterval(catId, setDeletingCategory);
      await dispatch(
        deleteCategory({ planId, bucketId, category_id: catId })
      ).unwrap();
      await dispatch(fetchAllCategories({ planId, bucketId })).unwrap();
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      showToastMessage('Category deleted successfully');
      await dispatch(fetchSingleBudget(planId)).unwrap();
      setSelectedCategory(null);
      setDeletingCategory((prev) => ({
        ...prev,
        [catId]: { isDeleting: false, progress: 0 },
      }));
      clearInterval(intervalId);
    } catch (err) {
      setIsDeleting(false);
      showErrorMessage(err?.response?.data?.message || 'Something went wrong. Try again!');
      setDeletingCategory((prev) => ({
        ...prev,
        [catId]: { isDeleting: false, progress: 0 },
      }));
    }
  };

  const sortedCategories =
    categories &&
    [...categories].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const fmt = (n) =>
    Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(n || 0);

  return (
    <div className='mb-6'>
      {categories?.length === 0 ? (
        <div className='bg-white rounded-2xl border border-slate-100 p-8'>
          <Empty
            text='No expense categories yet'
            subtext='Create a category to start tracking expenses'
            onAddAction={() => setIsAddCategoryOpen(true)}
          />
        </div>
      ) : (
        <div className='space-y-3'>
          {sortedCategories?.map((category) => {
            const cid = docId(category);
            const progress = category.amount > 0 ? Math.min((category.total_expenses / category.amount) * 100, 100) : 0;
            const isOver = category.total_expenses > category.amount;

            return (
              <div
                key={cid}
                className='bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden'
              >
                <div className={`h-1 ${isOver ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{ width: `${progress}%` }} />
                <div className='p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <button
                      onClick={() => handleCategoryExpenseClick(category)}
                      className='flex items-center gap-2 text-left group'
                    >
                      <h3 className='font-bold text-slate-900 capitalize group-hover:text-emerald-700 transition-colors'>
                        {category.name}
                      </h3>
                      <ChevronRight className='h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors' />
                    </button>
                    <div className='flex items-center gap-1'>
                      <button
                        onClick={() => handleCategoryExpenseClick(category)}
                        className='flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors'
                        title='Log an expense in this category'
                      >
                        <PlusCircle className='h-3.5 w-3.5' />
                        Add expense
                      </button>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors'
                        title='Edit category'
                      >
                        <Edit className='h-3.5 w-3.5' />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(category)}
                        className='p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors'
                        title='Delete category'
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => handleCategoryExpenseClick(category)} className='w-full text-left'>
                    <div className='flex justify-between text-sm mb-2'>
                      <div>
                        <span className='text-slate-400 text-xs'>Budget: </span>
                        <span className='font-semibold text-slate-700 text-xs'>
                          {currencySymbol(currency)} {fmt(category.amount)}
                        </span>
                      </div>
                      <div>
                        <span className='text-slate-400 text-xs'>Spent: </span>
                        <span className={`font-semibold text-xs ${isOver ? 'text-rose-600' : 'text-slate-700'}`}>
                          {currencySymbol(currency)} {fmt(category.total_expenses)}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-400' : 'bg-emerald-400'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>

                  {deletingCategory[cid]?.isDeleting && (
                    <div className='mt-2'>
                      <CustomProgress value={deletingCategory[cid]?.progress} />
                    </div>
                  )}
                </div>
              </div>
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
