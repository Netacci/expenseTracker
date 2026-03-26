import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/navbar/Layout';
import {
  RefreshCw,
  Sparkles,
  Trash2,
  Loader2,
  Pencil,
  PlusCircle,
  CalendarIcon,
  Receipt,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { showErrorMessage, showToastMessage } from '../../components/toast/Toast';
import {
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  updateSubscription,
} from '../../redux/subscriptionSlice';
import { fetchAllBudgets } from '../../redux/budgetSlice';
import { currencySymbol, formatAmount } from '../../utils/helper';
import { docId } from '../../utils/docId';
import { format } from 'date-fns';
import { userRequest } from '../../utils/requestMethods';

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'NGN',
  'KES',
  'GHS',
  'ZAR',
  'INR',
  'CAD',
  'AUD',
];

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading } = useSelector((state) => state.subscription);
  const { budgets } = useSelector((state) => state.budget);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loggingPayment, setLoggingPayment] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showInlineAddCategory, setShowInlineAddCategory] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    subscription_id: '',
    subscriptionCurrency: '',
    name: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    planId: '',
    bucketId: '',
    categoryId: '',
  });
  const [form, setForm] = useState({
    service_name: '',
    amount: '',
    currency: 'USD',
    billing_cycle: 'monthly',
    next_charge_date: '',
  });

  useEffect(() => {
    dispatch(fetchSubscriptions());
    dispatch(fetchAllBudgets());
  }, [dispatch]);

  const selectedPlan = useMemo(
    () => (budgets || []).find((p) => docId(p) === paymentForm.planId),
    [budgets, paymentForm.planId]
  );
  const matchingCurrencyPlans = useMemo(
    () =>
      (budgets || []).filter(
        (p) =>
          !paymentForm.subscriptionCurrency ||
          p.currency === paymentForm.subscriptionCurrency
      ),
    [budgets, paymentForm.subscriptionCurrency]
  );
  const selectedBucket = useMemo(
    () =>
      (selectedPlan?.buckets || []).find((bucket) => docId(bucket) === paymentForm.bucketId),
    [selectedPlan, paymentForm.bucketId]
  );

  const monthlyCommitment = useMemo(
    () =>
      (subscriptions || [])
        .filter((s) => s.status === 'active')
        .reduce((sum, s) => {
          const amount = Number(s.amount || 0);
          return sum + (s.billing_cycle === 'yearly' ? amount / 12 : amount);
        }, 0),
    [subscriptions]
  );
  const commitmentCurrency = useMemo(() => {
    const active = (subscriptions || []).filter((s) => s.status === 'active');
    return active[0]?.currency || 'USD';
  }, [subscriptions]);

  const resetForm = () => {
    setForm({
      service_name: '',
      amount: '',
      currency: 'USD',
      billing_cycle: 'monthly',
      next_charge_date: '',
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.service_name.trim() || !form.amount) return;
    try {
      setCreating(true);
      if (editingId) {
        await dispatch(
          updateSubscription({
            id: editingId,
            service_name: form.service_name.trim(),
            amount: Number(form.amount),
            currency: form.currency.trim() || 'USD',
            billing_cycle: form.billing_cycle,
            next_charge_date: form.next_charge_date || null,
          })
        ).unwrap();
        showToastMessage('Subscription updated');
      } else {
        await dispatch(
          createSubscription({
            service_name: form.service_name.trim(),
            amount: Number(form.amount),
            currency: form.currency.trim() || 'USD',
            billing_cycle: form.billing_cycle,
            next_charge_date: form.next_charge_date || undefined,
            status: 'active',
          })
        ).unwrap();
        showToastMessage('Subscription added');
      }
      resetForm();
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not save subscription');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (sub) => {
    setEditingId(docId(sub));
    setIsFormOpen(true);
    setForm({
      service_name: sub.service_name || '',
      amount: String(sub.amount ?? ''),
      currency: sub.currency || 'USD',
      billing_cycle: sub.billing_cycle || 'monthly',
      next_charge_date: sub.next_charge_date
        ? String(sub.next_charge_date).slice(0, 10)
        : '',
    });
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await dispatch(deleteSubscription(id)).unwrap();
      showToastMessage('Subscription deleted');
      if (editingId === id) resetForm();
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not delete subscription');
    } finally {
      setDeletingId(null);
    }
  };

  const openLogPayment = (sub) => {
    const plans = (budgets || []).filter((p) => p.currency === sub.currency);
    const firstPlan = plans[0];
    const firstBucket = firstPlan?.buckets?.[0];
    const firstCategory = firstBucket?.categories?.[0];

    setPaymentForm({
      subscription_id: docId(sub),
      subscriptionCurrency: sub.currency || 'USD',
      name: `${sub.service_name} subscription`,
      amount: String(sub.amount ?? ''),
      date: format(new Date(), 'yyyy-MM-dd'),
      planId: firstPlan ? docId(firstPlan) : '',
      bucketId: firstBucket ? docId(firstBucket) : '',
      categoryId: firstCategory ? docId(firstCategory) : '',
    });
    setIsPaymentOpen(true);
  };

  const handlePlanChange = (planId) => {
    const plan = (budgets || []).find((p) => docId(p) === planId);
    const firstBucket = plan?.buckets?.[0];
    const firstCategory = firstBucket?.categories?.[0];
    setPaymentForm((prev) => ({
      ...prev,
      planId,
      bucketId: firstBucket ? docId(firstBucket) : '',
      categoryId: firstCategory ? docId(firstCategory) : '',
    }));
  };

  const handleBucketChange = (bucketId) => {
    const bucket = (selectedPlan?.buckets || []).find((b) => docId(b) === bucketId);
    const firstCategory = bucket?.categories?.[0];
    setPaymentForm((prev) => ({
      ...prev,
      bucketId,
      categoryId: firstCategory ? docId(firstCategory) : '',
    }));
    setShowInlineAddCategory(false);
    setNewCategoryName('');
  };

  const handleLogPaymentSubmit = async (e) => {
    e.preventDefault();
    if (
      !paymentForm.planId ||
      !paymentForm.bucketId ||
      !paymentForm.categoryId ||
      !paymentForm.name.trim() ||
      !paymentForm.amount ||
      !paymentForm.date
    ) {
      showErrorMessage('Please fill all payment fields.');
      return;
    }
    if (selectedPlan?.currency !== paymentForm.subscriptionCurrency) {
      showErrorMessage(
        `Currency mismatch. This subscription is in ${paymentForm.subscriptionCurrency}, so you can only log it to ${paymentForm.subscriptionCurrency} plans.`
      );
      return;
    }
    try {
      setLoggingPayment(true);
      await userRequest.post(
        `monthly-plans/${paymentForm.planId}/buckets/${paymentForm.bucketId}/categories/${paymentForm.categoryId}/expense/create`,
        {
          name: paymentForm.name.trim(),
          amount: Number(paymentForm.amount),
          date: paymentForm.date,
        }
      );
      showToastMessage('Payment logged to expenses');
      setIsPaymentOpen(false);
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not log payment');
    } finally {
      setLoggingPayment(false);
    }
  };

  const handleCreateCategoryForPayment = async () => {
    const name = newCategoryName.trim();
    if (!paymentForm.planId || !paymentForm.bucketId || !name) {
      showErrorMessage('Select a plan/group and enter category name first.');
      return;
    }
    try {
      setCreatingCategory(true);
      const response = await userRequest.post(
        `monthly-plans/${paymentForm.planId}/buckets/${paymentForm.bucketId}/category/create`,
        { name, amount: 0 }
      );
      const created = response?.data?.data;
      const createdId = docId(created);
      if (!createdId) {
        showErrorMessage('Category was created but could not be selected.');
        return;
      }
      await dispatch(fetchAllBudgets()).unwrap();
      setPaymentForm((prev) => ({ ...prev, categoryId: createdId }));
      setNewCategoryName('');
      setShowInlineAddCategory(false);
      showToastMessage('Category created');
    } catch (err) {
      showErrorMessage(err?.response?.data?.message || 'Could not create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <Layout>
      <div className='max-w-4xl'>
        <div className='flex items-start gap-4 mb-8'>
          <div className='w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center flex-shrink-0'>
            <RefreshCw className='h-6 w-6 text-cyan-600' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900'>Subscriptions</h1>
            <p className='text-slate-500 text-sm mt-1'>
              Track recurring services, renewal dates, and monthly commitment.
            </p>
          </div>
        </div>

        <div className='mb-4 flex justify-end'>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm({
                service_name: '',
                amount: '',
                currency: 'USD',
                billing_cycle: 'monthly',
                next_charge_date: '',
              });
              setIsFormOpen(true);
            }}
          >
            <PlusCircle className='h-4 w-4 mr-1' />
            Create subscription
          </Button>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit subscription' : 'Create subscription'}
              </DialogTitle>
              <DialogDescription>
                Add recurring service details and the next charge date.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='grid gap-3 md:grid-cols-2'>
            <Input
              value={form.service_name}
              onChange={(e) => setForm((prev) => ({ ...prev, service_name: e.target.value }))}
              placeholder='Service name'
            />
            <Select
              value={form.currency}
              onValueChange={(value) => setForm((prev) => ({ ...prev, currency: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select currency' />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type='number'
              min='0'
              step='0.01'
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder='Amount'
            />
            <Select
              value={form.billing_cycle}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, billing_cycle: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Billing cycle' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='monthly'>Monthly</SelectItem>
                <SelectItem value='yearly'>Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !form.next_charge_date && 'text-slate-500'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {form.next_charge_date
                    ? format(new Date(form.next_charge_date), 'PPP')
                    : 'Pick next charge date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    form.next_charge_date ? new Date(form.next_charge_date) : undefined
                  }
                  onSelect={(date) =>
                    setForm((prev) => ({
                      ...prev,
                      next_charge_date: date ? format(date, 'yyyy-MM-dd') : '',
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className='md:col-span-2 flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={resetForm}>
                {editingId ? 'Cancel edit' : 'Cancel'}
              </Button>
              <Button
                type='submit'
                disabled={creating || !form.service_name.trim() || !form.amount}
              >
                {creating ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : editingId ? (
                  'Update subscription'
                ) : (
                  'Add subscription'
                )}
              </Button>
            </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Log subscription payment</DialogTitle>
              <DialogDescription>
                Save this subscription charge as an expense in one of your plans.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogPaymentSubmit} className='grid gap-3 md:grid-cols-2'>
              <Input
                value={paymentForm.name}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder='Expense name'
              />
              <Input
                type='number'
                min='0'
                step='0.01'
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder='Amount'
              />
              <Select value={paymentForm.planId} onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select plan' />
                </SelectTrigger>
                <SelectContent>
                  {matchingCurrencyPlans.map((plan) => (
                    <SelectItem key={docId(plan)} value={docId(plan)}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!matchingCurrencyPlans.length ? (
                <p className='text-xs text-rose-600'>
                  No plan found in {paymentForm.subscriptionCurrency}. Create a{' '}
                  {paymentForm.subscriptionCurrency} plan first.
                </p>
              ) : (
                <div />
              )}
              <Select value={paymentForm.bucketId} onValueChange={handleBucketChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select spending group' />
                </SelectTrigger>
                <SelectContent>
                  {(selectedPlan?.buckets || []).map((bucket) => (
                    <SelectItem key={docId(bucket)} value={docId(bucket)}>
                      {bucket.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={paymentForm.categoryId}
                onValueChange={(value) => {
                  if (value === '__add_category__') {
                    setShowInlineAddCategory(true);
                    return;
                  }
                  setShowInlineAddCategory(false);
                  setNewCategoryName('');
                  setPaymentForm((prev) => ({ ...prev, categoryId: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {(selectedBucket?.categories || []).map((category) => (
                    <SelectItem key={docId(category)} value={docId(category)}>
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value='__add_category__'>+ Add category</SelectItem>
                </SelectContent>
              </Select>
              {showInlineAddCategory ? (
                <div className='flex gap-2'>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder='New category name'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    disabled={creatingCategory || !newCategoryName.trim()}
                    onClick={handleCreateCategoryForPayment}
                  >
                    {creatingCategory ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      'Save'
                    )}
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => {
                      setShowInlineAddCategory(false);
                      setNewCategoryName('');
                    }}
                    title='Cancel'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div />
              )}
              <Input
                type='date'
                value={paymentForm.date}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />

              <div className='md:col-span-2 flex justify-end gap-2 pt-2'>
                <Button type='button' variant='outline' onClick={() => setIsPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit' disabled={loggingPayment}>
                  {loggingPayment ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    'Log payment'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className='mb-4 text-sm text-slate-600'>
          Active monthly commitment:{' '}
          <span className='font-semibold text-slate-900'>
            {currencySymbol(commitmentCurrency)} {formatAmount(monthlyCommitment)}
          </span>
        </div>

        {!loading && !(subscriptions || []).length ? (
          <div className='bg-white rounded-2xl border border-slate-100 border-dashed p-10 text-center'>
            <Sparkles className='h-10 w-10 text-slate-300 mx-auto mb-4' />
            <p className='text-slate-600 font-medium'>No subscriptions yet.</p>
            <p className='text-slate-400 text-sm mt-2'>
              Add your first recurring service above.
            </p>
          </div>
        ) : (
          <div className='grid gap-3 md:grid-cols-2'>
            {(subscriptions || []).map((sub) => {
              const sid = docId(sub);
              const monthly =
                sub.billing_cycle === 'yearly'
                  ? Number(sub.amount || 0) / 12
                  : Number(sub.amount || 0);
              return (
                <div
                  key={sid}
                  className='bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-3'
                >
                  <div className='min-w-0'>
                    <p className='font-semibold text-slate-900 truncate'>{sub.service_name}</p>
                    <p className='text-xs text-slate-500'>
                      {currencySymbol(sub.currency || 'USD')} {formatAmount(sub.amount)} /{' '}
                      {sub.billing_cycle} · ~{currencySymbol(sub.currency || 'USD')}{' '}
                      {formatAmount(monthly)} monthly
                    </p>
                    {sub.next_charge_date ? (
                      <p className='text-xs text-slate-500'>
                        Next charge: {String(sub.next_charge_date).slice(0, 10)}
                      </p>
                    ) : null}
                  </div>
                  <div className='flex items-center gap-1 shrink-0'>
                    <Button
                      variant='ghost'
                      size='icon'
                      title='Log payment as expense'
                      onClick={() => openLogPayment(sub)}
                    >
                      <Receipt className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => startEdit(sub)}>
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-rose-500'
                      disabled={deletingId === sid}
                      onClick={() => handleDelete(sid)}
                    >
                      {deletingId === sid ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Subscriptions;
