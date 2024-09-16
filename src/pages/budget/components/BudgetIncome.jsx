/* eslint-disable react/prop-types */
import Empty from '../../../components/empty/Empty';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteIncome, fetchAllIncomes } from '../../../redux/incomeSlice';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import AddNewIncome from './AddNewIncome';
import DeleteModal from '../../../components/deleteModal/DeleteModal';
import {
  showErrorMessage,
  showToastMessage,
} from '../../../components/toast/Toast';
import { currencySymbol, startProgressInterval } from '../../../utils/helper';
import CustomProgress from '../../../components/customProgress/CustomProgress';
import { fetchSingleBudget } from '../../../redux/budgetSlice';

const BudgetIncome = ({ currency }) => {
  const [selectedIncome, setSelectedIncome] = useState(null);
  const dispatch = useDispatch();
  const { incomes } = useSelector((state) => state.income);
  const { id } = useParams();
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingIncome, setDeletingIncome] = useState({});
  useEffect(() => {
    dispatch(fetchAllIncomes(id));
  }, [dispatch, id]);

  const handleIncomeClick = (income) => {
    setSelectedIncome(income);
    setIsAddIncomeOpen(true);
  };
  const sortedIncomes =
    incomes && [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
  const handleOpenDelete = (income) => {
    setShowDeleteConfirm(true);
    setSelectedIncome(income);
  };
  const handleCloseDelete = () => {
    if (!isDeleting) {
      setShowDeleteConfirm(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeletingIncome((prev) => ({
        ...prev,
        [selectedIncome.id]: { isDeleting: true, progress: 0 },
      }));
      const intervalId = startProgressInterval(
        selectedIncome.id,
        setDeletingIncome
      );
      await dispatch(
        deleteIncome({ id, income_id: selectedIncome.id })
      ).unwrap();
      await dispatch(fetchAllIncomes(id)).unwrap();
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      showToastMessage('Income deleted successfully');
      await dispatch(fetchSingleBudget(id)).unwrap();
      setSelectedIncome(null);
      setDeletingIncome((prev) => ({
        ...prev,
        [selectedIncome.id]: { isDeleting: false, progress: 0 },
      }));
      clearInterval(intervalId);
    } catch (err) {
      setIsDeleting(false);
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
      setDeletingIncome((prev) => ({
        ...prev,
        [selectedIncome.id]: { isDeleting: false, progress: 0 },
      }));
    }
  };

  return (
    <div>
      {' '}
      {/* <h2 className='text-xl sm:text-2xl font-bold mb-2'>Income</h2> */}
      {incomes?.length === 0 ? (
        <Empty
          text='No income added yet'
          subtext={'Add new income'}
          onAddAction={() => setIsAddIncomeOpen(true)}
        />
      ) : (
        <ul className='space-y-3'>
          {sortedIncomes?.map((income) => (
            <li
              key={income.id}
              className='bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer'
            >
              <div className='flex justify-between items-center'>
                <div
                  // onClick={() => handleIncomeClick(income)}
                  className='flex-grow'
                >
                  <p className='font-semibold text-gray-800 capitalize'>
                    {income.name}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {format(new Date(income.date), 'PPP')}
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  <p className={`font-bold text-green-500`}>
                    {currencySymbol(currency)}{' '}
                    {Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(income.amount || 0.0)}
                  </p>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleIncomeClick(income)}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleOpenDelete(income)}
                  >
                    <Trash2 className='h-4 w-4 text-red-500' />
                  </Button>
                </div>
              </div>
              {deletingIncome[income?.id]?.isDeleting && (
                <div className='mt-2'>
                  <CustomProgress
                    value={deletingIncome[income?.id]?.progress}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <AddNewIncome
        isAddIncomeOpen={isAddIncomeOpen}
        setIsAddIncomeOpen={setIsAddIncomeOpen}
        editingIncome={selectedIncome}
        setEditingIncome={setSelectedIncome}
      />
      <DeleteModal
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        name={selectedIncome?.name}
        label='income'
        handleCloseDelete={handleCloseDelete}
      />
    </div>
  );
};

export default BudgetIncome;
