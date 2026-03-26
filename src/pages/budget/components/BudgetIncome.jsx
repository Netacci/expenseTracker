/* eslint-disable react/prop-types */
import Empty from '../../../components/empty/Empty';
import { Edit, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteIncome, fetchAllIncomes } from '../../../redux/incomeSlice';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import AddNewIncome from './AddNewIncome';
import DeleteModal from '../../../components/deleteModal/DeleteModal';
import { showErrorMessage, showToastMessage } from '../../../components/toast/Toast';
import { currencySymbol, startProgressInterval } from '../../../utils/helper';
import CustomProgress from '../../../components/customProgress/CustomProgress';
import { fetchSingleBudget } from '../../../redux/budgetSlice';
import { docId } from '../../../utils/docId';

const BudgetIncome = ({ currency, isAddIncomeOpen, setIsAddIncomeOpen }) => {
  const [selectedIncome, setSelectedIncome] = useState(null);
  const dispatch = useDispatch();
  const { incomes } = useSelector((state) => state.income);
  const { planId } = useParams();
  const [_isAddIncomeOpen, _setIsAddIncomeOpen] = useState(false);
  const addOpen = isAddIncomeOpen !== undefined ? isAddIncomeOpen : _isAddIncomeOpen;
  const setAddOpen = setIsAddIncomeOpen !== undefined ? setIsAddIncomeOpen : _setIsAddIncomeOpen;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingIncome, setDeletingIncome] = useState({});

  useEffect(() => {
    if (planId) dispatch(fetchAllIncomes(planId));
  }, [dispatch, planId]);

  const handleIncomeClick = (income) => {
    setSelectedIncome(income);
    setAddOpen(true);
  };

  const sortedIncomes =
    incomes && [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleOpenDelete = (income) => {
    setShowDeleteConfirm(true);
    setSelectedIncome(income);
  };

  const handleCloseDelete = () => {
    if (!isDeleting) setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    const incomeId = docId(selectedIncome);
    try {
      setIsDeleting(true);
      setDeletingIncome((prev) => ({
        ...prev,
        [incomeId]: { isDeleting: true, progress: 0 },
      }));
      const intervalId = startProgressInterval(incomeId, setDeletingIncome);
      await dispatch(
        deleteIncome({ planId, income_id: incomeId })
      ).unwrap();
      await dispatch(fetchAllIncomes(planId)).unwrap();
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      showToastMessage('Income deleted successfully');
      await dispatch(fetchSingleBudget(planId)).unwrap();
      setSelectedIncome(null);
      setDeletingIncome((prev) => ({
        ...prev,
        [incomeId]: { isDeleting: false, progress: 0 },
      }));
      clearInterval(intervalId);
    } catch (err) {
      setIsDeleting(false);
      showErrorMessage(err?.response?.data?.message || 'Something went wrong. Try again!');
      setDeletingIncome((prev) => ({
        ...prev,
        [incomeId]: { isDeleting: false, progress: 0 },
      }));
    }
  };

  const fmt = (n) =>
    Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(n || 0);

  return (
    <div>
      {incomes?.length === 0 ? (
        <div className='bg-white rounded-2xl border border-slate-100 p-8'>
          <Empty
            text='No income added yet'
            subtext='Add your income sources to track your budget'
            onAddAction={() => setAddOpen(true)}
          />
        </div>
      ) : (
        <div className='space-y-2'>
          {sortedIncomes?.map((income) => (
            <div
              key={docId(income)}
              className='bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 p-4'
            >
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <TrendingUp className='h-5 w-5 text-emerald-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-slate-900 capitalize truncate'>{income.name}</p>
                  <p className='text-xs text-slate-400 mt-0.5'>
                    {format(new Date(income.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <p className='font-bold text-emerald-600 text-base'>
                    {currencySymbol(currency)} {fmt(income.amount)}
                  </p>
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={() => handleIncomeClick(income)}
                      className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors'
                    >
                      <Edit className='h-3.5 w-3.5' />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(income)}
                      className='p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors'
                    >
                      <Trash2 className='h-3.5 w-3.5' />
                    </button>
                  </div>
                </div>
              </div>
              {deletingIncome[docId(income)]?.isDeleting && (
                <div className='mt-2'>
                  <CustomProgress value={deletingIncome[docId(income)]?.progress} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddNewIncome
        isAddIncomeOpen={addOpen}
        setIsAddIncomeOpen={setAddOpen}
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
