/* eslint-disable react/prop-types */
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatAmount } from '../../../utils/helper';

const INCOME_COLOR = '#10b981';
const EXPENSE_COLOR = '#f43f5e';
const BAR_COLORS = ['#f43f5e', '#a78bfa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white rounded-xl shadow-lg border border-slate-100 p-3'>
        {label && <p className='text-xs font-semibold text-slate-600 mb-2'>{label}</p>}
        {payload.map((entry) => (
          <div key={entry.name} className='flex items-center gap-2 text-sm'>
            <div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: entry.color }} />
            <span className='text-slate-600 font-medium'>{entry.name}:</span>
            <span className='text-slate-900 font-bold'>
              {formatAmount(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Charts = ({ totalExpenses, totalIncome, budgets }) => {
  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
  ];

  const barData = budgets?.map((b) => ({
    name: b.name.length > 10 ? b.name.slice(0, 10) + '…' : b.name,
    Spent: b.total_expenses || 0,
    Remaining: Math.max(b.balance || 0, 0),
  }));

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {/* Pie chart */}
      <div className='bg-white rounded-2xl border border-slate-100 shadow-card p-5'>
        <div className='mb-4'>
          <h3 className='text-base font-bold text-slate-900'>Income vs Expenses</h3>
          <p className='text-xs text-slate-400 mt-0.5'>Overall across all budgets</p>
        </div>
        <div className='h-56'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='50%'
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey='value'
              >
                <Cell fill={INCOME_COLOR} />
                <Cell fill={EXPENSE_COLOR} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className='text-xs font-medium text-slate-600'>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='flex gap-4 mt-1'>
          <div className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 rounded-full bg-emerald-500' />
            <span className='text-xs text-slate-500 font-medium'>
              Income: {formatAmount(totalIncome)}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 rounded-full bg-rose-500' />
            <span className='text-xs text-slate-500 font-medium'>
              Expenses: {formatAmount(totalExpenses)}
            </span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className='bg-white rounded-2xl border border-slate-100 shadow-card p-5'>
        <div className='mb-4'>
          <h3 className='text-base font-bold text-slate-900'>Budget Overview</h3>
          <p className='text-xs text-slate-400 mt-0.5'>Spent vs remaining per budget</p>
        </div>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={barData} barSize={12}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' vertical={false} />
              <XAxis
                dataKey='name'
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatAmount(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className='text-xs font-medium text-slate-600'>{value}</span>
                )}
              />
              <Bar dataKey='Spent' stackId='a' fill={BAR_COLORS[0]} radius={[0, 0, 4, 4]} />
              <Bar dataKey='Remaining' stackId='a' fill={BAR_COLORS[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
