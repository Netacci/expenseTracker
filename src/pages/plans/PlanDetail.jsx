import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/navbar/Layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSingleBudget,
  deleteBudget,
  fetchAllBudgets,
  generateReport,
  fetchSavedPlanReport,
} from '../../redux/budgetSlice';
import {
  createBucket,
  deleteBucket,
} from '../../redux/monthlyPlanSlice';
import { showErrorMessage, showToastMessage } from '../../components/toast/Toast';
import { ROUTES } from '../../utils/routes';
import DeleteModal from '../../components/deleteModal/DeleteModal';
import BudgetSummary from '../budget/components/BudgetSummary';
import BudgetChart from '../budget/components/BudgetChart';
import BudgetIncome from '../budget/components/BudgetIncome';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchAllIncomes } from '../../redux/incomeSlice';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  PlusCircle,
  FolderOpen,
  Trash2,
  Pencil,
  Loader2,
  Sparkles,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import { format } from 'date-fns';
import { currencySymbol, formatAmount } from '../../utils/helper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { docId } from '../../utils/docId';
import AddBudgetForm from '../budgets/components/AddBudget';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { budget: plan, loading: planLoading } = useSelector(
    (state) => state.budget
  );

  const [showDeletePlan, setShowDeletePlan] = useState(false);
  const [addIncomeOpen, setAddIncomeOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);
  const [bucketSheetOpen, setBucketSheetOpen] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');
  const [creatingBucket, setCreatingBucket] = useState(false);
  const [deletingBucketId, setDeletingBucketId] = useState(null);
  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportHtml, setReportHtml] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [confirmGenerateOpen, setConfirmGenerateOpen] = useState(false);
  const [loadingSavedReport, setLoadingSavedReport] = useState(false);

  const tab = searchParams.get('tab');
  const activeTab = ['spending', 'income'].includes(tab) ? tab : 'spending';

  useEffect(() => {
    dispatch(fetchSingleBudget(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    dispatch(fetchAllIncomes(planId));
  }, [dispatch, planId]);

  const handleDeletePlan = async () => {
    try {
      setIsDeletingPlan(true);
      await dispatch(deleteBudget(planId)).unwrap();
      showToastMessage('Monthly plan deleted');
      await dispatch(fetchAllBudgets()).unwrap();
      navigate(ROUTES.budgets);
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not delete plan');
    } finally {
      setIsDeletingPlan(false);
      setShowDeletePlan(false);
    }
  };

  const handleCreateBucket = async (e) => {
    e.preventDefault();
    if (!newBucketName.trim()) return;
    try {
      setCreatingBucket(true);
      await dispatch(
        createBucket({
          planId,
          name: newBucketName.trim(),
          description: '',
        })
      ).unwrap();
      setNewBucketName('');
      setBucketSheetOpen(false);
      showToastMessage('Spending group added');
      await dispatch(fetchSingleBudget(planId)).unwrap();
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not create group');
    } finally {
      setCreatingBucket(false);
    }
  };

  const handleViewSavedReport = async () => {
    try {
      setLoadingSavedReport(true);
      const data = await dispatch(fetchSavedPlanReport(planId)).unwrap();
      const html = data?.html;
      if (!html || typeof html !== 'string') {
        showErrorMessage('Saved report could not be loaded.');
        return;
      }
      setReportHtml(html);
      setReportDialogOpen(true);
    } catch (err) {
      showErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          'Could not load saved report.'
      );
    } finally {
      setLoadingSavedReport(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const data = await dispatch(generateReport(planId)).unwrap();
      const html = data?.report;
      if (!html || typeof html !== 'string') {
        showErrorMessage('Report response was empty.');
        return;
      }
      setReportHtml(html);
      setReportDialogOpen(true);
      showToastMessage('Report saved — you can open it anytime from Tabs.');
      await dispatch(fetchSingleBudget(planId)).unwrap();
      await dispatch(fetchAllBudgets()).unwrap();
    } catch (err) {
      showErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          'Could not generate report. Check that the server has GROQ_API_KEY set.'
      );
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDeleteBucket = async (bucketId) => {
    try {
      setDeletingBucketId(bucketId);
      await dispatch(deleteBucket({ planId, bucketId })).unwrap();
      showToastMessage('Group removed');
      await dispatch(fetchSingleBudget(planId)).unwrap();
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not remove group');
    } finally {
      setDeletingBucketId(null);
    }
  };

  const totalIncome = plan?.total_income ?? 0;
  const totalExpenses = plan?.total_expenses ?? 0;
  const totalBudget = plan?.total_budget ?? 0;
  const balance = plan?.balance ?? totalIncome - totalExpenses;
  const warningvalue = totalExpenses > totalIncome;

  const getChartData = () =>
    (plan?.buckets || []).map((b) => ({
      name: b.name,
      budget: b.total_budget,
      spent: b.total_expenses,
    }));

  const getIncomeVsExpensesData = () => [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
  ];

  if (planLoading && !plan) {
    return (
      <Layout>
        <div className='animate-pulse h-40 bg-slate-100 rounded-2xl' />
      </Layout>
    );
  }

  if (!planLoading && !plan) {
    return (
      <Layout>
        <div className='text-center py-16'>
          <p className='text-slate-600'>Plan not found.</p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => navigate(ROUTES.budgets)}
          >
            Back to plans
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='pb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
          <div className='flex items-start gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-xl'
              onClick={() => navigate(ROUTES.budgets)}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <div className='flex flex-wrap items-center gap-2'>
                <h1 className='text-2xl font-bold text-slate-900'>{plan?.name}</h1>
                <span className='rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5'>
                  Monthly plan
                </span>
              </div>
              <p className='text-sm text-slate-500 mt-1'>
                {plan?.start_date &&
                  format(new Date(plan.start_date), 'MMM d')}{' '}
                –{' '}
                {plan?.end_date &&
                  format(new Date(plan.end_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              className='rounded-xl border-emerald-200 text-emerald-700'
              onClick={() => {
                setSearchParams({ tab: 'income' });
                setAddIncomeOpen(true);
              }}
            >
              <PlusCircle className='h-4 w-4 mr-1' />
              Add income
            </Button>

            {/* More actions */}
            <div className='relative'>
              <Button
                variant='outline'
                size='icon'
                className='rounded-xl'
                onClick={() => setMoreMenuOpen((v) => !v)}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
              {moreMenuOpen && (
                <>
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setMoreMenuOpen(false)}
                  />
                  <div className='absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[220px]'>
                    <button
                      className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50'
                      onClick={() => { setEditPlanOpen(true); setMoreMenuOpen(false); }}
                    >
                      <Pencil className='h-4 w-4 text-slate-400' />
                      Edit plan
                    </button>
                    <button
                      className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50'
                      onClick={() => { setBucketSheetOpen(true); setMoreMenuOpen(false); }}
                    >
                      <FolderOpen className='h-4 w-4 text-slate-400' />
                      Add group
                    </button>
                    {plan?.hasSavedReport ? (
                      <button
                        className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-violet-700 hover:bg-violet-50 disabled:opacity-50'
                        onClick={() => { handleViewSavedReport(); setMoreMenuOpen(false); }}
                        disabled={loadingSavedReport}
                      >
                        {loadingSavedReport ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <FileText className='h-4 w-4' />
                        )}
                        View saved report
                      </button>
                    ) : (
                      <button
                        className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-violet-700 hover:bg-violet-50 disabled:opacity-50'
                        onClick={() => { setConfirmGenerateOpen(true); setMoreMenuOpen(false); }}
                        disabled={generatingReport}
                      >
                        {generatingReport ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Sparkles className='h-4 w-4' />
                        )}
                        AI report
                      </button>
                    )}
                    <div className='my-1 border-t border-slate-100' />
                    <button
                      className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50'
                      onClick={() => { setShowDeletePlan(true); setMoreMenuOpen(false); }}
                    >
                      <Trash2 className='h-4 w-4' />
                      Delete plan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {warningvalue && (
          <div className='flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 mb-6'>
            <p className='text-sm text-rose-700 font-medium'>
              Plan expenses exceed total income for this month.
            </p>
          </div>
        )}

        {/* Compact stats strip */}
        {(() => {
          const sym = currencySymbol(plan?.currency);
          const spendRate = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
          const rateColor = spendRate > 100 ? 'text-rose-600' : spendRate > 80 ? 'text-amber-600' : 'text-emerald-600';
          return (
            <div className='flex flex-wrap gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-6'>
              <div className='flex-1 min-w-[90px]'>
                <p className='text-xs text-slate-400 font-medium'>Income</p>
                <p className='text-base font-bold text-emerald-600'>{sym} {formatAmount(totalIncome)}</p>
              </div>
              <div className='w-px bg-slate-100 self-stretch' />
              <div className='flex-1 min-w-[90px]'>
                <p className='text-xs text-slate-400 font-medium'>Spent</p>
                <p className='text-base font-bold text-rose-500'>{sym} {formatAmount(totalExpenses)}</p>
              </div>
              <div className='w-px bg-slate-100 self-stretch' />
              <div className='flex-1 min-w-[90px]'>
                <p className='text-xs text-slate-400 font-medium'>Balance</p>
                <p className={`text-base font-bold ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>{sym} {formatAmount(balance)}</p>
              </div>
              <div className='w-px bg-slate-100 self-stretch' />
              <div className='flex-1 min-w-[90px]'>
                <p className='text-xs text-slate-400 font-medium'>Spend rate</p>
                <p className={`text-base font-bold ${rateColor}`}>{spendRate}%</p>
              </div>
            </div>
          );
        })()}

        <Tabs
          value={activeTab}
          onValueChange={(v) => setSearchParams({ tab: v })}
          className='w-full'
        >
          <TabsList className='flex bg-white border border-slate-100 shadow-card rounded-2xl p-1 mb-6 gap-1'>
            <TabsTrigger
              value='spending'
              className='flex-1 py-2 px-4 rounded-xl text-sm font-medium text-slate-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white'
            >
              Spending
            </TabsTrigger>
            <TabsTrigger
              value='income'
              className='flex-1 py-2 px-4 rounded-xl text-sm font-medium text-slate-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white'
            >
              Income
            </TabsTrigger>
          </TabsList>

          <TabsContent value='spending'>
            <div className='mb-3'>
              <p className='text-xs text-slate-500'>
                Open a spending area → add categories (e.g. Groceries, Rent) → tap a category to log an expense
              </p>
            </div>
            {!plan?.buckets?.length ? (
              <div className='bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm'>
                Loading…
              </div>
            ) : (
              <div className='grid gap-3 md:grid-cols-2'>
                {plan.buckets.map((b) => {
                  const bid = docId(b);
                  return (
                    <div
                      key={bid}
                      className='group bg-white rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all overflow-hidden'
                    >
                      <Link
                        to={`/plans/${planId}/buckets/${bid}?tab=expenses`}
                        className='flex items-center justify-between gap-4 px-5 py-4'
                      >
                        <div className='min-w-0'>
                          <p className='font-semibold text-slate-900 truncate'>{b.name}</p>
                          <p className='text-xs text-slate-500 mt-0.5'>
                            Spent {currencySymbol(plan.currency)}{' '}
                            {formatAmount(b.total_expenses)} · Budget{' '}
                            {currencySymbol(plan.currency)} {formatAmount(b.total_budget)}
                          </p>
                        </div>
                        <span className='text-sm font-semibold text-emerald-700 whitespace-nowrap shrink-0 group-hover:translate-x-0.5 transition-transform'>
                          Open →
                        </span>
                      </Link>
                      {plan.buckets.length > 1 && (
                        <div className='border-t border-slate-100 px-4 py-1.5 flex justify-end'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 px-2 text-xs text-rose-500 hover:bg-rose-50'
                            disabled={deletingBucketId === bid}
                            title='Remove group'
                            onClick={() => handleDeleteBucket(bid)}
                          >
                            {deletingBucketId === bid ? (
                              <Loader2 className='h-3.5 w-3.5 animate-spin' />
                            ) : (
                              <Trash2 className='h-3.5 w-3.5' />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Charts — below the fold, not blocking the primary action */}
            <details className='mt-8 group/insights'>
              <summary className='flex items-center gap-2 text-sm font-medium text-slate-500 cursor-pointer hover:text-slate-700 select-none list-none'>
                <span className='w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs group-open/insights:rotate-90 transition-transform'>›</span>
                View charts &amp; insights
              </summary>
              <div className='mt-4'>
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
              </div>
            </details>
          </TabsContent>

          <TabsContent value='income'>
            <BudgetIncome
              currency={plan?.currency}
              isAddIncomeOpen={addIncomeOpen}
              setIsAddIncomeOpen={setAddIncomeOpen}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={bucketSheetOpen} onOpenChange={setBucketSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add spending group</SheetTitle>
            <p className='text-sm text-slate-500 font-normal text-left pt-1'>
              Optional. Use this if you want a separate set of categories (e.g. &quot;Work&quot; vs &quot;Home&quot;). Most people only need the default &quot;Spending&quot; area.
            </p>
          </SheetHeader>
          <form onSubmit={handleCreateBucket} className='space-y-4 mt-4'>
            <div>
              <Label>Name</Label>
              <Input
                value={newBucketName}
                onChange={(e) => setNewBucketName(e.target.value)}
                placeholder='e.g. Work expenses'
              />
            </div>
            <SheetFooter>
              <Button type='submit' disabled={creatingBucket || !newBucketName.trim()}>
                {creatingBucket ? (
                  <Loader2 className='animate-spin h-4 w-4' />
                ) : (
                  'Create'
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <DeleteModal
        showDeleteConfirm={showDeletePlan}
        setShowDeleteConfirm={setShowDeletePlan}
        handleDelete={handleDeletePlan}
        isDeleting={isDeletingPlan}
        name={plan?.name}
        label='monthly plan'
        handleCloseDelete={() => {
          if (!isDeletingPlan) setShowDeletePlan(false);
        }}
      />

      <AddBudgetForm
        isOpen={editPlanOpen}
        onClose={() => setEditPlanOpen(false)}
        plan={plan}
        mode='edit'
      />

      <AlertDialog open={confirmGenerateOpen} onOpenChange={setConfirmGenerateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate report only once</AlertDialogTitle>
            <AlertDialogDescription className='text-left space-y-2'>
              <span className='block'>
                You can generate one AI report per monthly plan.
              </span>
              <span className='block text-slate-600'>
                It&apos;s best to run this near the end of the month when your
                spending data is mostly complete.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              className='bg-violet-600 hover:bg-violet-700'
              onClick={() => {
                setConfirmGenerateOpen(false);
                void handleGenerateReport();
              }}
              disabled={generatingReport}
            >
              {generatingReport ? (
                <Loader2 className='h-4 w-4 mr-1 animate-spin' />
              ) : null}
              Generate now
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-4xl flex flex-col gap-0 p-0 overflow-hidden'>
          <DialogHeader className='px-6 pt-6 pb-2 text-left'>
            <DialogTitle>AI spending report</DialogTitle>
            <DialogDescription>
              Reopen anytime from <strong>Reports</strong> in
              the sidebar.
            </DialogDescription>
          </DialogHeader>
          <div className='flex-1 min-h-0 px-6 pb-6'>
            {reportHtml ? (
              <iframe
                title='AI spending report'
                srcDoc={reportHtml}
                className='w-full h-[min(70vh,560px)] rounded-lg border border-slate-200 bg-white'
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PlanDetail;
