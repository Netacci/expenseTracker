/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  Trash2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  CalendarDays,
  PlusCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../components/navbar/Layout';
import AddBudgetForm from './components/AddBudget';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBudget, fetchAllBudgets } from '../../redux/budgetSlice';
import { format } from 'date-fns';
import { Toaster } from 'react-hot-toast';
import { showErrorMessage, showToastMessage } from '../../components/toast/Toast';
import DeleteModal from '../../components/deleteModal/DeleteModal';
import Empty from '../../components/empty/Empty';
import { currencySymbol, startProgressInterval } from '../../utils/helper';
import CustomProgress from '../../components/customProgress/CustomProgress';
import { docId } from '../../utils/docId';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as UiCalendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const DateRangeInput = ({ value, onChange, placeholder }) => {
  const selectedDate = value ? new Date(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-slate-500'
          )}
        >
          <CalendarDays className='mr-2 h-4 w-4' />
          {selectedDate ? format(selectedDate, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <UiCalendar
          mode='single'
          selected={selectedDate}
          onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
          initialFocus
        />
        {value ? (
          <div className='border-t p-2'>
            <Button variant='ghost' className='w-full' onClick={() => onChange('')}>
              Clear date
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

const BudgetCard = ({ budget, onEdit, onDelete, isDeleting, deleteProgress }) => {
  const pid = docId(budget);
  const firstBucketId = budget?.buckets?.length ? docId(budget.buckets[0]) : null;
  const isOverBudget = budget.total_expenses > budget.total_income;
  const spendPercent = budget.total_income > 0
    ? Math.min((budget.total_expenses / budget.total_income) * 100, 100)
    : 0;
  const fmt = (n) =>
    Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(n || 0);

  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden'>
      <div className={`h-1.5 ${isOverBudget ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{ width: `${spendPercent}%` }} />
      <div className='p-5'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1 min-w-0 mr-3'>
            <h3 className='text-base font-bold text-slate-900 truncate'>{budget?.name}</h3>
            <div className='flex items-center gap-1.5 mt-1'>
              <Calendar className='h-3.5 w-3.5 text-slate-400' />
              <p className='text-xs text-slate-400'>
                {format(new Date(budget?.start_date), 'MMM d')} – {format(new Date(budget?.end_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => onEdit(pid)}
              className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors'
            >
              <Pencil className='h-3.5 w-3.5' />
            </button>
            <button
              onClick={() => onDelete(pid)}
              className='p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors'
            >
              <Trash2 className='h-3.5 w-3.5' />
            </button>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div className='bg-slate-50 rounded-xl p-3'>
            <p className='text-xs text-slate-400 mb-1'>Total Budget</p>
            <p className='text-sm font-bold text-slate-900'>
              {currencySymbol(budget?.currency)} {fmt(budget?.total_budget)}
            </p>
          </div>
          <div className={`rounded-xl p-3 ${isOverBudget ? 'bg-rose-50' : 'bg-emerald-50'}`}>
            <p className='text-xs text-slate-400 mb-1'>Balance</p>
            <p className={`text-sm font-bold ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
              {currencySymbol(budget?.currency)} {fmt(budget?.balance)}
            </p>
          </div>
        </div>

        <div className='mb-4'>
          <div className='flex justify-between text-xs text-slate-500 mb-1.5'>
            <span>Spent</span>
            <span className={`font-semibold ${isOverBudget ? 'text-rose-600' : 'text-slate-700'}`}>
              {Math.round(spendPercent)}%
            </span>
          </div>
          <div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-400' : 'bg-emerald-400'}`}
              style={{ width: `${spendPercent}%` }}
            />
          </div>
          <div className='flex justify-between text-xs text-slate-400 mt-1'>
            <div className='flex items-center gap-1'>
              <TrendingDown className='h-3 w-3 text-rose-400' />
              <span>{currencySymbol(budget?.currency)} {fmt(budget?.total_expenses)} spent</span>
            </div>
            <div className='flex items-center gap-1'>
              <TrendingUp className='h-3 w-3 text-emerald-400' />
              <span>{currencySymbol(budget?.currency)} {fmt(budget?.total_income)} income</span>
            </div>
          </div>
        </div>

        {isDeleting && <CustomProgress value={deleteProgress} />}

        {/* Quick actions */}
        <div className='grid grid-cols-2 gap-2 mb-2'>
          <Link
            to={`/plans/${pid}?tab=income`}
            className='flex items-center justify-center gap-1.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors'
          >
            <PlusCircle className='h-3.5 w-3.5' />
            Add Income
          </Link>
          <Link
            to={
              firstBucketId
                ? `/plans/${pid}/buckets/${firstBucketId}?tab=expenses`
                : `/plans/${pid}`
            }
            className='flex items-center justify-center gap-1.5 py-2 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-colors'
          >
            <PlusCircle className='h-3.5 w-3.5' />
            Add Expense
          </Link>
        </div>

        <Link
          to={`/plans/${pid}`}
          className='group flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150'
        >
          View Details
          <ArrowRight className='h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform' />
        </Link>
      </div>
    </div>
  );
};

const Budgets = () => {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBudget, setDeletingBudget] = useState('');
  const [deletingaBudget, setDeletingaBudget] = useState({});
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { budgets } = useSelector((state) => state.budget);

  useEffect(() => {
    dispatch(fetchAllBudgets());
  }, [dispatch]);

  const handleEdit = (budgetId) => {
    setEditingBudget(budgets.find((b) => docId(b) === budgetId));
    setIsFormOpen(true);
  };

  const handleOpenDelete = (budgetId) => {
    setDeletingBudget(budgets.find((b) => docId(b) === budgetId));
    setShowDeleteConfirm(true);
  };

  const handleCloseDelete = () => {
    if (!isDeleting) setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const id = docId(deletingBudget);
      setDeletingaBudget((prev) => ({ ...prev, [id]: { isDeleting: true, progress: 0 } }));
      const intervalId = startProgressInterval(id, setDeletingaBudget);
      await dispatch(deleteBudget(id)).unwrap();
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      await dispatch(fetchAllBudgets()).unwrap();
      showToastMessage('Budget deleted successfully');
      setDeletingaBudget((prev) => ({ ...prev, [id]: { isDeleting: false, progress: 0 } }));
      clearInterval(intervalId);
      setDeletingBudget(null);
      setEditingBudget(null);
    } catch (err) {
      setIsDeleting(false);
      showErrorMessage(err?.response?.data?.message || 'Something went wrong. Try again!');
      setDeletingaBudget((prev) => ({
        ...prev,
        [docId(deletingBudget)]: { isDeleting: false, progress: 0 },
      }));
    }
  };

  const filteredBudgets = useMemo(() => {
    if (!Array.isArray(budgets)) return [];
    return budgets.filter((budget) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        String(budget?.name || '')
          .toLowerCase()
          .includes(q) ||
        String(budget?.description || '')
          .toLowerCase()
          .includes(q) ||
        String(budget?.currency || '')
          .toLowerCase()
          .includes(q);

      const overBudget = (budget?.total_expenses || 0) > (budget?.total_income || 0);
      const matchesHealth =
        healthFilter === 'all' ||
        (healthFilter === 'over' && overBudget) ||
        (healthFilter === 'ontrack' && !overBudget);

      const start = budget?.start_date ? new Date(budget.start_date) : null;
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const matchesDateRange =
        !start ||
        ((!from || start >= from) && (!to || start <= to));

      return matchesSearch && matchesHealth && matchesDateRange;
    });
  }, [budgets, search, healthFilter, fromDate, toDate]);

  return (
    <Layout>
      <Toaster />
      <div>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900'>Monthly plans</h2>
            <p className='text-slate-500 text-sm mt-0.5'>
              {budgets?.length || 0} month{budgets?.length !== 1 ? 's' : ''} · income + expenses in one place
            </p>
          </div>
        </div>

        <div className='bg-white border border-slate-100 rounded-2xl p-4 mb-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-3'>
            <div className='lg:col-span-5'>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search plans by name, description, or currency'
              />
            </div>
            <div className='lg:col-span-3'>
              <Select value={healthFilter} onValueChange={setHealthFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All statuses</SelectItem>
                  <SelectItem value='ontrack'>On track</SelectItem>
                  <SelectItem value='over'>Over budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='lg:col-span-2'>
              <DateRangeInput
                value={fromDate}
                onChange={setFromDate}
                placeholder='From month start'
              />
            </div>
            <div className='lg:col-span-2'>
              <DateRangeInput
                value={toDate}
                onChange={setToDate}
                placeholder='To month start'
              />
            </div>
          </div>
          <div className='mt-3 flex items-center justify-between text-xs text-slate-500'>
            <p>
              Showing {filteredBudgets.length} of {budgets?.length || 0} plans
            </p>
            <Button
              type='button'
              variant='ghost'
              className='h-7 px-2 text-xs'
              onClick={() => {
                setSearch('');
                setHealthFilter('all');
                setFromDate('');
                setToDate('');
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>

        {!budgets ? (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='bg-white rounded-2xl h-64 animate-pulse border border-slate-100' />
            ))}
          </div>
        ) : filteredBudgets.length > 0 ? (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredBudgets.map((budget) => (
              <BudgetCard
                key={docId(budget)}
                budget={budget}
                onEdit={handleEdit}
                onDelete={handleOpenDelete}
                isDeleting={deletingaBudget[docId(budget)]?.isDeleting}
                deleteProgress={deletingaBudget[docId(budget)]?.progress}
              />
            ))}
          </div>
        ) : (
          <div className='bg-white rounded-2xl border border-slate-100 p-12'>
            <Empty
              text={budgets?.length ? 'No plans match these filters' : 'No monthly plans yet'}
              subtext={
                budgets?.length
                  ? 'Try another search term, status, or date range.'
                  : 'Create a plan for a month, add income, then track spending with categories'
              }
              onAddAction={() => { setEditingBudget(null); setIsFormOpen(true); }}
            />
          </div>
        )}

        <DeleteModal
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
          name={deletingBudget?.name}
          handleCloseDelete={handleCloseDelete}
          label='budget'
        />
        <AddBudgetForm
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setEditingBudget(null); }}
          plan={editingBudget}
          mode={editingBudget ? 'edit' : 'create'}
        />
      </div>
    </Layout>
  );
};

export default Budgets;
