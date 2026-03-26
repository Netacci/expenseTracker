/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

/** Split on commas, newlines, or semicolons; trim; dedupe case-insensitively; max 24. */
function parseCategoryNames(raw) {
  const seen = new Set();
  const out = [];
  for (const part of String(raw).split(/[\n,;]+/)) {
    const name = part.trim().slice(0, 80);
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out.slice(0, 24);
}

function parseAmount(str) {
  const v = parseFloat(String(str).replace(/,/g, ''));
  if (Number.isNaN(v) || v < 0) return 0;
  return Math.round(v * 100) / 100;
}

/**
 * One question at a time: plan name → category list → period → budget per category.
 */
const GuidedBudgetWizard = ({ onSubmit, loading, disabled }) => {
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => y - 2 + i);
  }, []);
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NGN'];

  /** 'name' | 'categories' | 'period' | 'budget' */
  const [phase, setPhase] = useState('name');
  const [planName, setPlanName] = useState('');
  const [categoriesRaw, setCategoriesRaw] = useState('');
  const [categoryNames, setCategoryNames] = useState([]);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [currency, setCurrency] = useState('USD');
  const [budgetIndex, setBudgetIndex] = useState(0);
  const [amounts, setAmounts] = useState([]);
  const [amountInput, setAmountInput] = useState('');
  const [error, setError] = useState('');

  const totalQuestions = useMemo(() => {
    if (categoryNames.length > 0) return 3 + categoryNames.length;
    if (phase === 'categories') {
      const n = parseCategoryNames(categoriesRaw).length;
      return n > 0 ? 3 + n : null;
    }
    return null;
  }, [categoryNames.length, phase, categoriesRaw]);

  const questionIndex = useMemo(() => {
    if (phase === 'name') return 1;
    if (phase === 'categories') return 2;
    if (phase === 'period') return 3;
    return 4 + budgetIndex;
  }, [phase, budgetIndex]);

  useEffect(() => {
    if (phase !== 'budget' || categoryNames[budgetIndex] === undefined) return;
    const saved = amounts[budgetIndex];
    setAmountInput(saved != null && saved !== 0 ? String(saved) : '');
  }, [phase, budgetIndex, categoryNames, amounts]);

  const goNextFromName = () => {
    const t = planName.trim();
    if (!t) {
      setError('Enter a name for this plan.');
      return;
    }
    setError('');
    setPhase('categories');
  };

  const goNextFromCategories = () => {
    const names = parseCategoryNames(categoriesRaw);
    if (names.length === 0) {
      setError('Add at least one category (e.g. Food, Rent, Transport).');
      return;
    }
    setError('');
    setCategoryNames(names);
    setAmounts(Array(names.length).fill(0));
    setBudgetIndex(0);
    setPhase('period');
  };

  const goNextFromPeriod = () => {
    setError('');
    setPhase('budget');
    setBudgetIndex(0);
    setAmountInput('');
  };

  const finish = useCallback(
    async (finalAmounts) => {
      const categories = categoryNames.map((name, i) => ({
        name,
        amount: finalAmounts[i] ?? 0,
      }));
      await onSubmit({
        name: planName.trim(),
        currency,
        year: Number(year),
        month: Number(month),
        categories,
      });
    },
    [
      categoryNames,
      planName,
      currency,
      year,
      month,
      onSubmit,
    ]
  );

  const handleBudgetNext = () => {
    const v = parseAmount(amountInput);
    const nextAmounts = [...amounts];
    nextAmounts[budgetIndex] = v;
    setAmounts(nextAmounts);
    setError('');
    if (budgetIndex < categoryNames.length - 1) {
      setBudgetIndex((i) => i + 1);
    } else {
      finish(nextAmounts);
    }
  };

  const handleBack = () => {
    setError('');
    if (phase === 'categories') {
      setPhase('name');
    } else if (phase === 'period') {
      setPhase('categories');
    } else if (phase === 'budget') {
      const v = parseAmount(amountInput);
      const nextAmounts = [...amounts];
      nextAmounts[budgetIndex] = v;
      setAmounts(nextAmounts);
      if (budgetIndex > 0) {
        setBudgetIndex((i) => i - 1);
      } else {
        setPhase('period');
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (phase === 'name') goNextFromName();
    else if (phase === 'categories') goNextFromCategories();
    else if (phase === 'period') goNextFromPeriod();
    else handleBudgetNext();
  };

  const canContinue = () => {
    if (phase === 'name') return planName.trim().length > 0;
    if (phase === 'categories')
      return parseCategoryNames(categoriesRaw).length > 0;
    if (phase === 'period') return Boolean(currency && year && month);
    return true;
  };

  const currentCat = categoryNames[budgetIndex];
  const isLastBudget =
    phase === 'budget' && budgetIndex === categoryNames.length - 1;

  return (
    <div className='space-y-5 mt-2'>
      {totalQuestions != null && phase !== 'name' && (
        <p className='text-xs text-slate-500'>
          Question {questionIndex} of {totalQuestions}
        </p>
      )}

      <form onSubmit={handleFormSubmit} className='space-y-4'>
        {phase === 'name' && (
          <>
            <h3 className='text-lg font-semibold text-slate-900 leading-snug'>
              What do you want to call this plan?
            </h3>
            <Input
              autoFocus
              placeholder='e.g. March budget'
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className='text-base'
            />
          </>
        )}

        {phase === 'categories' && (
          <>
            <h3 className='text-lg font-semibold text-slate-900 leading-snug'>
              Which categories do you want to keep track of this month?
            </h3>
            <p className='text-sm text-slate-500'>
              List them separated by commas, new lines, or semicolons — we’ll ask
              for a budget amount for each one next.
            </p>
            <Textarea
              autoFocus
              rows={5}
              placeholder={
                'Food\nRent\nTransport\nSubscriptions'
              }
              value={categoriesRaw}
              onChange={(e) => setCategoriesRaw(e.target.value)}
              className='resize-none text-base min-h-[120px]'
            />
          </>
        )}

        {phase === 'period' && (
          <>
            <h3 className='text-lg font-semibold text-slate-900 leading-snug'>
              Which month is this for?
            </h3>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <span className='text-sm text-slate-600 mb-1 block'>Year</span>
                <Select
                  onValueChange={(v) => setYear(Number(v))}
                  value={String(year)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className='text-sm text-slate-600 mb-1 block'>Month</span>
                <Select
                  onValueChange={(v) => setMonth(Number(v))}
                  value={String(month)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <span className='text-sm text-slate-600 mb-1 block'>Currency</span>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
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
          </>
        )}

        {phase === 'budget' && currentCat && (
          <>
            <h3 className='text-lg font-semibold text-slate-900 leading-snug'>
              How much do you want to budget for{' '}
              <span className='text-emerald-700'>{currentCat}</span>?
            </h3>
            <p className='text-sm text-slate-500'>
              Planned amounts in {currency}. You can change these later.
            </p>
            <Input
              autoFocus
              type='text'
              inputMode='decimal'
              placeholder='0'
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className='text-base'
            />
            <p className='text-xs text-slate-400'>
              Category {budgetIndex + 1} of {categoryNames.length}
            </p>
          </>
        )}

        {error ? (
          <p className='text-sm text-red-600' role='alert'>
            {error}
          </p>
        ) : null}

        <div className='flex flex-wrap gap-2 justify-between pt-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleBack}
            disabled={loading || phase === 'name'}
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            Back
          </Button>
          <Button
            type='submit'
            disabled={loading || disabled || !canContinue()}
          >
            {loading ? (
              <Loader2 className='animate-spin h-4 w-4' />
            ) : phase === 'budget' && isLastBudget ? (
              'Create plan'
            ) : (
              <>
                Continue
                <ChevronRight className='h-4 w-4 ml-1' />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GuidedBudgetWizard;
