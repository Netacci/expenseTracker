/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch } from 'react-redux';
import {
  createMonthlyPlan,
  editMonthlyPlan,
} from '../../../redux/monthlyPlanSlice';
import { fetchAllBudgets } from '../../../redux/budgetSlice';
import { showErrorMessage, showToastMessage } from '../../../components/toast/Toast';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import GuidedBudgetWizard from './GuidedBudgetWizard';

/** Create (guided) or edit a monthly plan — income is shared; categories & expenses live under “Spending”. */
const AddBudgetForm = ({ isOpen, onClose, plan, mode = 'create' }) => {
  const [loading, setLoading] = useState(false);
  const [guidedWizardKey, setGuidedWizardKey] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      currency: 'USD',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      description: '',
    },
  });

  const { currency } = watch();

  /** Stable key so we don't depend on `plan` object identity (new ref every render). */
  const planKey = plan ? String(plan._id ?? plan.id) : null;

  /**
   * Sync form when the sheet opens or plan/mode context changes.
   * Never list `setValue` in deps — react-hook-form can give a new `setValue` reference
   * after updates, which would re-run this effect and clear `name` on every keystroke.
   */
  useEffect(() => {
    if (!isOpen) return;
    const d = new Date();
    if (mode === 'edit' && plan) {
      setValue('name', plan.name || '');
      setValue('currency', plan.currency || 'USD');
      setValue('year', plan.year ?? d.getFullYear());
      setValue('month', plan.month ?? d.getMonth() + 1);
      setValue('description', plan.description || '');
    } else if (mode === 'create') {
      setValue('name', '');
      setValue('currency', 'USD');
      setValue('year', d.getFullYear());
      setValue('month', d.getMonth() + 1);
      setValue('description', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- plan/setValue intentionally omitted; see above
  }, [isOpen, mode, planKey]);

  useEffect(() => {
    if (isOpen && mode === 'create') {
      setGuidedWizardKey((k) => k + 1);
    }
  }, [isOpen, mode]);

  const handleGuidedSubmit = async (payload) => {
    try {
      setLoading(true);
      const res = await dispatch(createMonthlyPlan(payload)).unwrap();
      await dispatch(fetchAllBudgets()).unwrap();
      navigate(`/plans/${res._id || res.id}`);
      onClose();
      showToastMessage(
        'Plan created — you can edit categories and amounts anytime.'
      );
    } catch (err) {
      showErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          'Could not create plan. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data) => {
    if (!plan) return;
    try {
      setLoading(true);
      const id = plan._id || plan.id;
      await dispatch(
        editMonthlyPlan({
          id,
          name: data.name?.trim(),
          currency: data.currency,
          description: data.description,
        })
      ).unwrap();
      await dispatch(fetchAllBudgets()).unwrap();
      onClose();
      showToastMessage('Plan updated');
    } catch (err) {
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
    } finally {
      setLoading(false);
    }
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NGN'];

  return (
    <>
      <Toaster />
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Edit monthly plan' : 'New monthly plan'}
            </DialogTitle>
            <DialogDescription className='text-left'>
              {mode === 'edit'
                ? 'Update the label, currency, or notes for this month.'
                : 'We’ll ask one question at a time, then create your plan with the budgets you set.'}
            </DialogDescription>
          </DialogHeader>

          {mode === 'create' ? (
            <GuidedBudgetWizard
              key={guidedWizardKey}
              onSubmit={handleGuidedSubmit}
              loading={loading}
              disabled={loading}
            />
          ) : (
            <form
              onSubmit={handleSubmit(handleEditSubmit)}
              className='space-y-4'
            >
              <div>
                <Label htmlFor='name'>Label (optional)</Label>
                <Input
                  id='name'
                  placeholder='e.g. March focus'
                  {...register('name')}
                  className='w-full'
                />
              </div>
              <div>
                <Label htmlFor='currency'>Currency</Label>
                <Select
                  onValueChange={(value) => setValue('currency', value)}
                  value={currency || 'USD'}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='description'>Notes (optional)</Label>
                <Textarea
                  id='description'
                  {...register('description')}
                  className='w-full'
                />
              </div>

              <DialogFooter>
                <Button type='submit' disabled={loading || !currency}>
                  {loading ? (
                    <Loader2 className='animate-spin h-4 w-4' />
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddBudgetForm;
