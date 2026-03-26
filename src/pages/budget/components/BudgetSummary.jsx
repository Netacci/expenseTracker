/* eslint-disable react/prop-types */
import { TrendingUp, TrendingDown, Wallet, Scale } from 'lucide-react';
import { currencySymbol, formatAmount } from '../../../utils/helper';

const MetricCard = ({ label, value, icon: Icon, colorClass, bgClass }) => (
  <div className='bg-white rounded-2xl border border-slate-100 shadow-card p-5'>
    <div className='flex items-start justify-between mb-3'>
      <div className={`w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
    </div>
    <p className='text-sm font-medium text-slate-500 mb-1'>{label}</p>
    <p className={`text-2xl font-bold tracking-tight ${colorClass}`}>{value}</p>
  </div>
);

const BudgetSummary = ({ totalBudget, totalIncome, totalExpenses, currency, balance }) => {
  const fmt = (n) =>
    `${currencySymbol(currency)} ${formatAmount(n)}`;

  const spendRate = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  return (
    <div className='mb-6'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <MetricCard
          label='Total Budget'
          value={fmt(totalBudget)}
          icon={Wallet}
          colorClass='text-slate-800'
          bgClass='bg-slate-100'
        />
        <MetricCard
          label='Total Income'
          value={fmt(totalIncome)}
          icon={TrendingUp}
          colorClass='text-emerald-600'
          bgClass='bg-emerald-50'
        />
        <MetricCard
          label='Total Expenses'
          value={fmt(totalExpenses)}
          icon={TrendingDown}
          colorClass='text-rose-500'
          bgClass='bg-rose-50'
        />
        <MetricCard
          label='Remaining Balance'
          value={fmt(balance)}
          icon={Scale}
          colorClass={balance >= 0 ? 'text-blue-600' : 'text-amber-600'}
          bgClass={balance >= 0 ? 'bg-blue-50' : 'bg-amber-50'}
        />
      </div>

      {/* Spend rate bar */}
      <div className='bg-white rounded-2xl border border-slate-100 shadow-card p-5'>
        <div className='flex items-center justify-between mb-3'>
          <div>
            <p className='text-sm font-semibold text-slate-900'>Spending Rate</p>
            <p className='text-xs text-slate-400 mt-0.5'>Expenses as % of income</p>
          </div>
          <span className={`text-lg font-bold ${spendRate > 100 ? 'text-rose-600' : spendRate > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {spendRate}%
          </span>
        </div>
        <div className='h-3 bg-slate-100 rounded-full overflow-hidden'>
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              spendRate > 100 ? 'bg-rose-400' : spendRate > 80 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(spendRate, 100)}%` }}
          />
        </div>
        <div className='flex justify-between text-xs text-slate-400 mt-1.5'>
          <span>0%</span>
          <span className={spendRate > 80 ? (spendRate > 100 ? 'text-rose-500 font-medium' : 'text-amber-500 font-medium') : ''}>
            {spendRate > 100 ? 'Over budget!' : spendRate > 80 ? 'Approaching limit' : 'On track'}
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
