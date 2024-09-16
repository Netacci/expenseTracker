/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../components/navbar/Layout';
import AddBudgetForm from './components/AddBudget';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBudget, fetchAllBudgets } from '../../redux/budgetSlice';
import { format } from 'date-fns';
import { Toaster } from 'react-hot-toast';
import {
  showErrorMessage,
  showToastMessage,
} from '../../components/toast/Toast';
import DeleteModal from '../../components/deleteModal/DeleteModal';
import Empty from '../../components/empty/Empty';
import { currencySymbol, startProgressInterval } from '../../utils/helper';
import CustomProgress from '../../components/customProgress/CustomProgress';

const Budgets = () => {
  const [viewMode, setViewMode] = useState('grid');
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  useEffect(() => {
    dispatch(fetchAllBudgets());
  }, [dispatch]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState('');
  const { budgets } = useSelector((state) => state.budget);
  const [deletingaBudget, setDeletingaBudget] = useState({});
  const handleEdit = (budgetId) => {
    setEditingBudget(budgets.find((budget) => budget.id === budgetId));
    setIsFormOpen(true);
  };
  const handleCloseDelete = () => {
    if (!isDeleting) {
      setShowDeleteConfirm(false);
    }
  };
  const handleOpenDelete = (budgetId) => {
    setDeletingBudget(budgets.find((budget) => budget.id === budgetId));
    setShowDeleteConfirm(true);
  };
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { id } = deletingBudget;
      setDeletingaBudget((prev) => ({
        ...prev,
        [id]: { isDeleting: true, progress: 0 },
      }));
      const intervalId = startProgressInterval(id, setDeletingaBudget);
      await dispatch(deleteBudget(id)).unwrap();
      setIsDeleting(false);
      setShowDeleteConfirm(false);

      await dispatch(fetchAllBudgets()).unwrap();
      showToastMessage('Budget deleted successfully');
      setDeletingaBudget((prev) => ({
        ...prev,
        [id]: { isDeleting: false, progress: 0 },
      }));
      clearInterval(intervalId);
      setDeletingBudget(null);
      setEditingBudget(null);
    } catch (err) {
      setIsDeleting(false);
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
      setDeletingaBudget((prev) => ({
        ...prev,
        [deletingBudget.id]: { isDeleting: false, progress: 0 },
      }));
    }
  };

  const renderBudgetItem = (budget) => (
    <div
      key={budget.id}
      className={`mb-4 ${viewMode === 'list' ? 'w-full' : ''}`}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>{budget?.name}</h3>
            <div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleEdit(budget.id)}
              >
                <Pencil className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleOpenDelete(budget.id)}
              >
                <Trash className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold'>
            {' '}
            {currencySymbol(budget?.currency)}{' '}
            {Intl.NumberFormat('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(budget?.total_budget || 0.0)}
          </p>
          <p className='text-sm text-gray-500'>
            {format(new Date(budget?.start_date), 'dd-MM-yyyy')} to{' '}
            {format(new Date(budget?.end_date), 'dd-MM-yyyy')}
          </p>
          <Link
            to={`/budget/${budget.id}`}
            className='text-green-500 hover:underline mt-2 inline-block'
          >
            View Details
          </Link>
        </CardContent>
        {deletingaBudget[budget?.id]?.isDeleting && (
          <div className='mt-2'>
            <CustomProgress value={deletingaBudget[budget?.id]?.progress} />
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <Layout>
      <Toaster />
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Your Budgets</h2>
          <div>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setViewMode('grid')}
              className='mr-2'
            >
              <Grid className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setViewMode('list')}
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>
        {budgets?.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                : ''
            }
          >
            {budgets?.map(renderBudgetItem)}
          </div>
        ) : (
          <Empty
            text="You don't have any budget"
            subtext='  Get started by creating a new budget.'
            onAddAction={() => setIsFormOpen(true)}
          />
        )}
        <DeleteModal
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
          name={deletingBudget?.name}
          handleCloseDelete={handleCloseDelete}
          label={'budget'}
        />
        <AddBudgetForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
          }}
          budget={editingBudget}
        />
      </div>
    </Layout>
  );
};

export default Budgets;
