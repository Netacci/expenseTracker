import { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/navbar/Layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { fetchSingleBudget } from '../../redux/budgetSlice';
import { deleteBucket, editBucket } from '../../redux/monthlyPlanSlice';
import { showErrorMessage, showToastMessage } from '../../components/toast/Toast';
import DeleteModal from '../../components/deleteModal/DeleteModal';
import BudgetCategories from './components/BudgetCategories';
import BudgetChart from './components/BudgetChart';
import BudgetSummary from './components/BudgetSummary';
import BudgetHeader from './components/BudgetHeader';
import RecentExpenses from './components/RecentExpenses';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchRecentExpenses } from '../../redux/expenseSlice';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { docId } from '../../utils/docId';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const BudgetTracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planId, bucketId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { budget: plan, loading: planLoading } = useSelector(
    (state) => state.budget
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { categories } = useSelector((state) => state.expense);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const { recentExpenses } = useSelector((state) => state.expense);
  const [bucketNameEdit, setBucketNameEdit] = useState('');
  const [savingBucket, setSavingBucket] = useState(false);

  const bucket = useMemo(() => {
    if (!plan?.buckets || !bucketId) return null;
    return plan.buckets.find((b) => String(docId(b)) === String(bucketId));
  }, [plan, bucketId]);

  useEffect(() => {
    dispatch(fetchSingleBudget(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    dispatch(fetchRecentExpenses(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    if (bucket) setBucketNameEdit(bucket.name || '');
  }, [bucket]);

  const bucketExpensesFiltered = useMemo(() => {
    if (!recentExpenses?.length) return [];
    return recentExpenses.filter(
      (e) => String(e.bucketId) === String(bucketId)
    );
  }, [recentExpenses, bucketId]);

  const handleDeleteBucket = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteBucket({ planId, bucketId })).unwrap();
      showToastMessage('Spending group removed');
      navigate(`/plans/${planId}`);
    } catch (err) {
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveBucketName = async (e) => {
    e?.preventDefault?.();
    if (!bucketNameEdit.trim()) return;
    try {
      setSavingBucket(true);
      await dispatch(
        editBucket({
          planId,
          bucketId,
          name: bucketNameEdit.trim(),
          description: bucket?.description || '',
        })
      ).unwrap();
      setIsFormOpen(false);
      showToastMessage('Updated');
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not update');
    } finally {
      setSavingBucket(false);
    }
  };

  const totalIncome = plan?.total_income || 0;
  const totalExpenses = bucket?.total_expenses || 0;
  const totalBudget = bucket?.total_budget || 0;
  const balance = bucket?.balance ?? totalBudget - totalExpenses;
  const warningvalue = totalExpenses > totalIncome;

  const tabParam = searchParams.get('tab');
  const activeTab = ['summary', 'expenses'].includes(tabParam)
    ? tabParam
    : 'expenses';

  /** Default bucket URL to ?tab=expenses when missing or invalid. */
  useEffect(() => {
    if (!bucketId) return;
    setSearchParams(
      (prev) => {
        const t = prev.get('tab');
        if (['summary', 'expenses'].includes(t)) return prev;
        const next = new URLSearchParams(prev);
        next.set('tab', 'expenses');
        return next;
      },
      { replace: true }
    );
  }, [bucketId, setSearchParams]);

  const getChartData = () =>
    categories?.map((category) => ({
      name: category.name,
      budget: category.amount,
      spent: category.total_expenses,
    }));

  const getIncomeVsExpensesData = () => [
    { name: 'Plan income', value: totalIncome },
    { name: 'This area', value: totalExpenses },
  ];

  if (planLoading && !plan) {
    return (
      <Layout>
        <div className='animate-pulse h-48 bg-slate-100 rounded-2xl' />
      </Layout>
    );
  }

  if (!planLoading && !plan) {
    return (
      <Layout>
        <div className='text-center py-16'>
          <p className='text-slate-600 mb-4'>Plan not found.</p>
          <Button onClick={() => navigate('/plans')}>Back to plans</Button>
        </div>
      </Layout>
    );
  }

  if (plan && !bucket) {
    return (
      <Layout>
        <div className='text-center py-16'>
          <p className='text-slate-600 mb-4'>Spending area not found.</p>
          <Button onClick={() => navigate(`/plans/${planId}`)}>
            Back to plan
          </Button>
        </div>
      </Layout>
    );
  }

  const handleBucketTabChange = (v) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', v);
        return next;
      },
      { replace: true }
    );
  };

  return (
    <Layout>
      <div className='mb-5'>
        <Button
          variant='ghost'
          size='sm'
          className='rounded-xl -ml-2 mb-2'
          onClick={() => navigate(`/plans/${planId}`)}
        >
          <ArrowLeft className='h-4 w-4 mr-1' />
          Back to plan
        </Button>
        {plan && bucket && (
          <nav
            className='text-sm text-slate-500 flex flex-wrap items-center gap-1.5'
            aria-label='Breadcrumb'
          >
            <span className='font-medium text-slate-800 truncate max-w-[min(100%,12rem)]'>
              {plan.name}
            </span>
            <span aria-hidden>/</span>
            <span className='text-slate-700 font-semibold truncate max-w-[min(100%,14rem)]'>
              {bucket.name}
            </span>
            <span className='ml-1 rounded-full bg-violet-100 text-violet-800 text-xs font-medium px-2 py-0.5 shrink-0'>
              Spending area
            </span>
          </nav>
        )}
      </div>

      {plan && bucket && (
        <div className='pb-4 border-l-4 border-violet-400 pl-4 -ml-1 sm:pl-5 sm:ml-0'>
          <BudgetHeader
            handleEdit={() => setIsFormOpen(true)}
            handleOpenDelete={() => setShowDeleteConfirm(true)}
            budget={{ ...bucket, currency: plan.currency }}
            plan={plan}
            setIsAddIncomeOpen={() => navigate(`/plans/${planId}?tab=income`)}
            setIsAddCategoryOpen={setIsAddCategoryOpen}
            activeTab={activeTab}
            hideIncomeActions
            alwaysShowAddCategory
            subtitle='Categories & expenses live here'
          />

          {warningvalue && (
            <div className='flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 mb-6'>
              <AlertTriangle className='h-5 w-5 text-rose-500 flex-shrink-0' />
              <p className='text-sm text-rose-700 font-medium'>
                Spending here exceeds your plan&apos;s total income.
                Manage income on the{' '}
                <button
                  type='button'
                  className='underline font-semibold'
                  onClick={() => navigate(`/plans/${planId}?tab=income`)}
                >
                  plan
                </button>
                .
              </p>
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={handleBucketTabChange}
            className='w-full'
          >
            <TabsList className='flex w-full max-w-md bg-white border border-slate-100 shadow-card rounded-2xl p-1 mb-6 gap-1'>
              <TabsTrigger
                value='expenses'
                className='flex-1 py-2 px-4 rounded-xl text-sm font-medium text-slate-600 data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200'
              >
                Spending
              </TabsTrigger>
              <TabsTrigger
                value='summary'
                className='flex-1 py-2 px-4 rounded-xl text-sm font-medium text-slate-600 data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200'
              >
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value='expenses' className='space-y-4'>
              {(!categories || categories.length === 0) && (
                <div className='rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900'>
                  <p className='font-semibold mb-2'>Getting started</p>
                  <ol className='space-y-1 list-none'>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5'>1</span>
                      <span>Click <span className='font-semibold'>Add category</span> above to create a line (e.g. Groceries, Rent, Transport)</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5'>2</span>
                      <span>Then hit <span className='font-semibold'>Add expense</span> on any category to record what you spent</span>
                    </li>
                  </ol>
                </div>
              )}
              <BudgetCategories
                isAddCategoryOpen={isAddCategoryOpen}
                setIsAddCategoryOpen={setIsAddCategoryOpen}
                currency={plan?.currency}
              />
              <RecentExpenses
                categories={categories}
                expenses={bucketExpensesFiltered}
                currency={plan?.currency}
              />
            </TabsContent>

            <TabsContent value='summary'>
              <p className='text-sm text-slate-500 mb-4'>
                These totals are for <span className='font-medium text-slate-700'>{bucket.name}</span> only. Open the plan for full-month income and all groups.
              </p>
              <BudgetSummary
                totalBudget={totalBudget}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                currency={plan?.currency}
                balance={balance}
              />
              <BudgetChart
                getIncomeVsExpensesData={getIncomeVsExpensesData}
                getChartData={getChartData}
              />
            </TabsContent>
          </Tabs>

          <DeleteModal
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleDelete={handleDeleteBucket}
            isDeleting={isDeleting}
            name={bucket?.name}
            label='spending group'
            handleCloseDelete={() => {
              if (!isDeleting) setShowDeleteConfirm(false);
            }}
          />
          <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Rename spending group</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSaveBucketName} className='space-y-4 mt-4'>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={bucketNameEdit}
                    onChange={(e) => setBucketNameEdit(e.target.value)}
                  />
                </div>
                <SheetFooter>
                  <Button type='submit' disabled={savingBucket}>
                    {savingBucket ? (
                      <Loader2 className='animate-spin h-4 w-4' />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </Layout>
  );
};

export default BudgetTracker;
